
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

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>', // Use onboarding email for free tier, or configure a verified domain
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
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Resend error:', errorData);
      return json({ error: 'Failed to send email. Please try again later.' }, 500);
    }

    return json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return json({ error: 'Failed to process request.' }, 400);
  }
}
