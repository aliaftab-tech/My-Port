
export const config = { runtime: 'edge' };

const json = (body: unknown, status: number = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });



function clientIp(request: Request): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    '127.0.0.1'
  );
}

// Very basic rate limiting: 5 messages per hour per IP.
const ratelimit = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ratelimit.get(ip);
  if (entry && entry.reset > now) {
    if (entry.count >= 5) return true;
    entry.count++;
    return false;
  }
  ratelimit.set(ip, { count: 1, reset: now + 3600000 }); // 1 hour window
  return false;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { allow: 'POST, OPTIONS' } });
  }
  if (request.method !== 'POST') {
    return json({ error: 'Use POST.' }, 405);
  }

  if (!process.env.RESEND_API_KEY) {
    return json({ error: 'Contact form is not configured yet (missing API key).' }, 500);
  }

  if (rateLimited(clientIp(request))) {
    return json({ error: 'Too many requests. Please try again later.' }, 429);
  }

  try {
    const body = (await request.json()) as { name?: string; email?: string; message?: string };
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return json({ error: 'Name, email, and message are required.' }, 400);
    }

    const [resAdmin, resClient] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Ali Aftab <hello@aliaftab.dev>', // Must be a verified domain on Resend
          to: ['hello@aliaftab.dev'],
          subject: `New Contact Form Submission from ${name}`,
          reply_to: email,
          html: `
            <h2>New Contact Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          `,
        }),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Ali Aftab <hello@aliaftab.dev>', // Must be a verified domain on Resend
          to: [email],
          subject: `Thanks for reaching out, ${name}!`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; background-color: #0a0a0a; color: #D7E2EA; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);">
              <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 24px; font-size: 24px; font-weight: 600; letter-spacing: -0.02em;">Message Received!</h2>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: rgba(215, 226, 234, 0.8);">
                Hi ${name},
              </p>
              <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: rgba(215, 226, 234, 0.8);">
                Thanks for getting in touch. I've received your message and will review it shortly. You can expect a reply soon.
              </p>
              <div style="background-color: rgba(200, 107, 255, 0.05); border-left: 3px solid #C86BFF; padding: 20px; margin-bottom: 32px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6; font-style: italic; color: rgba(215, 226, 234, 0.6);">
                  "${message}"
                </p>
              </div>
              <p style="font-size: 16px; line-height: 1.6; margin: 0; color: rgba(215, 226, 234, 0.8);">
                Best regards,<br>
                <strong style="color: white; display: inline-block; margin-top: 8px;">Ali Aftab</strong><br>
                <a href="https://aliaftab.dev" style="color: #C86BFF; text-decoration: none; font-size: 14px; margin-top: 4px; display: inline-block;">aliaftab.dev</a>
              </p>
            </div>
          `,
        }),
      })
    ]);

    if (!resAdmin.ok || !resClient.ok) {
      console.error('Resend error: Admin', await resAdmin.text());
      console.error('Resend error: Client', await resClient.text());
      return json({ error: 'Failed to send emails. Please try again later.' }, 500);
    }

    return json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return json({ error: 'Failed to process request.' }, 400);
  }
}
