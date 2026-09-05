import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(result.error || 'Failed to send message.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again later.');
    }
  };

  if (status === 'success') {
    return (
      <div className="my-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#C86BFF]/30 bg-[#C86BFF]/10 p-8 text-center text-[#D7E2EA]">
        <CheckCircle className="text-[#C86BFF]" size={40} />
        <div>
          <h3 className="mb-1 text-lg font-medium text-white">Message sent!</h3>
          <p className="text-sm text-[#D7E2EA]/80">
            Thanks for reaching out. Ali will get back to you shortly at the email you provided.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-2xl border border-[#D7E2EA]/10 bg-[#101011] p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="mb-1 text-lg font-medium text-white">Send a message</h3>
        <p className="text-sm text-[#D7E2EA]/70">Fill out the form below and Ali will get back to you soon.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/60">
            Name
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            disabled={status === 'submitting'}
            className="rounded-lg border border-[#D7E2EA]/15 bg-transparent px-3 py-2.5 text-[15px] text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:border-[#C86BFF]/50 focus:outline-none focus:ring-1 focus:ring-[#C86BFF]/50 disabled:opacity-50"
            placeholder="Jane Doe"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/60">
            Email
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            disabled={status === 'submitting'}
            className="rounded-lg border border-[#D7E2EA]/15 bg-transparent px-3 py-2.5 text-[15px] text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:border-[#C86BFF]/50 focus:outline-none focus:ring-1 focus:ring-[#C86BFF]/50 disabled:opacity-50"
            placeholder="jane@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-[#D7E2EA]/60">
            Message
          </label>
          <textarea
            required
            id="message"
            name="message"
            rows={4}
            disabled={status === 'submitting'}
            className="resize-none rounded-lg border border-[#D7E2EA]/15 bg-transparent px-3 py-2.5 text-[15px] text-[#D7E2EA] placeholder:text-[#D7E2EA]/30 focus:border-[#C86BFF]/50 focus:outline-none focus:ring-1 focus:ring-[#C86BFF]/50 disabled:opacity-50"
            placeholder="Hi Ali, I need a website for..."
          />
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle size={16} />
            <p>{errorMsg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="mt-2 flex h-11 items-center justify-center gap-2 rounded-lg bg-white font-medium text-black transition-all hover:bg-[#D7E2EA] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>
    </div>
  );
}
