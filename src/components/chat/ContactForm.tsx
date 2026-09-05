import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, MessageCircle, Mail, ArrowLeft } from 'lucide-react';
import { CONTACT } from '../../data/profile';

export default function ContactForm() {
  const [view, setView] = useState<'selection' | 'email'>('selection');
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
      <div className="group relative my-6 overflow-hidden rounded-[24px] border border-white/5 bg-black/40 p-10 text-center shadow-[0_0_40px_-15px_rgba(200,107,255,0.3)] backdrop-blur-xl transition-all duration-700 hover:border-white/10 hover:bg-black/60">
        {/* Glow Effects */}
        <div className="absolute -left-[50%] -top-[50%] -z-10 h-[200%] w-[200%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(200,107,255,0.15)_360deg)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="absolute left-1/2 top-0 -z-10 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C86BFF]/30 blur-[60px]" />
        
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#C86BFF]/30 bg-gradient-to-br from-[#C86BFF]/20 to-transparent shadow-inner">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <CheckCircle className="text-[#C86BFF] drop-shadow-[0_0_15px_rgba(200,107,255,0.8)]" size={32} strokeWidth={2.5} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight text-white drop-shadow-md">Message sent!</h3>
            <p className="max-w-[280px] text-[15px] leading-relaxed text-[#D7E2EA]/70">
              Thanks for reaching out. Ali will get back to you shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const cleanWhatsapp = CONTACT.whatsapp.replace(/[^0-9]/g, '');

  if (view === 'selection') {
    return (
      <div className="my-4 rounded-2xl border border-[#D7E2EA]/10 bg-[#101011] p-5 text-center sm:p-6">
        <h3 className="mb-6 text-lg font-medium text-white">How would you like to connect?</h3>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={`https://wa.me/${cleanWhatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3 text-[14px] font-bold uppercase tracking-[0.15em] text-white transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(to right, #056a50, #09a779)',
              boxShadow: '0 0 20px rgba(9, 167, 121, 0.4)',
            }}
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>

          <button
            onClick={() => setView('email')}
            className="flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3 text-[14px] font-bold uppercase tracking-[0.15em] text-white transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(to right, #6b149b, #b33979)',
              boxShadow: '0 0 20px rgba(179, 57, 121, 0.4)',
            }}
          >
            <Mail size={20} />
            Email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-2xl border border-[#D7E2EA]/10 bg-[#101011] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-lg font-medium text-white">Send a message</h3>
          <p className="text-sm text-[#D7E2EA]/70">Fill out the form below and Ali will get back to you soon.</p>
        </div>
        <button 
          onClick={() => setView('selection')}
          className="rounded-full p-2 text-[#D7E2EA]/60 transition-colors hover:bg-[#D7E2EA]/10 hover:text-[#D7E2EA]"
          aria-label="Back to selection"
        >
          <ArrowLeft size={20} />
        </button>
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
