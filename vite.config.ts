import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Runs the `api/` folder during `npm run dev`.
 *
 * In production Vercel turns every file in `api/` into an edge function; the
 * dev server knows nothing about that convention, so /api/chat would 404 and
 * the chat page would only ever work once deployed. This middleware loads the
 * same module Vercel would, calls the same exported handler, and streams the
 * same response back — so a bug in the API shows up locally rather than in
 * production.
 *
 * `.env` is read here too, because the handler reads `process.env` the way the
 * edge runtime hands it over, not `import.meta.env`.
 */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      // Empty prefix: the server-side keys have no VITE_ prefix on purpose, so
      // that nothing can pull them into the client bundle by accident.
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''));

      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const path = req.url?.split('?')[0];
        if (!path?.startsWith('/api/')) return next();

        try {
          const module = await server.ssrLoadModule(`.${path}.ts`);
          const handler = module.default as (request: Request) => Promise<Response>;

          const headers = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value);
            else if (Array.isArray(value)) headers.set(key, value.join(', '));
          }

          const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
          const body = hasBody ? await readBody(req) : undefined;

          const response = await handler(
            new Request(`http://localhost${req.url}`, { method: req.method, headers, body })
          );

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            // Node owns the hop-by-hop headers on this connection; setting them
            // by hand is how a dev-only "socket hang up" happens.
            if (key === 'connection' || key === 'content-length') return;
            res.setHeader(key, value);
          });
          res.flushHeaders();

          if (!response.body) {
            res.end();
            return;
          }

          for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
            res.write(chunk);
          }
          res.end();
        } catch (error) {
          server.config.logger.error(`[dev-api] ${path} failed: ${String(error)}`);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
          }
          res.end(JSON.stringify({ error: 'The dev API route threw. See the terminal.' }));
        }
      });
    },
  };
}

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devApi()],
});
