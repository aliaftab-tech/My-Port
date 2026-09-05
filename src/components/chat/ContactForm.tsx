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

    return (
      <div className="my-4 relative overflow-hidden flex flex-col items-center justify-center gap-5 rounded-3xl border border-white/[0.06] bg-[#0A0A0B]/80 backdrop-blur-2xl p-10 sm:p-12 text-center shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full bg-[#C86BFF] opacity-[0.12] blur-[50px] pointer-events-none" />
        
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#C86BFF]/20 to-[#C86BFF]/5 border border-[#C86BFF]/30 shadow-[0_0_30px_rgba(200,107,255,0.2)]">
          <CheckCircle className="text-[#C86BFF]" size={32} strokeWidth={1.5} />
        </div>
        
        <div className="relative z-10 mt-2">
          <h3 className="mb-2.5 text-xl tracking-wide font-light text-white">Message Sent</h3>
          <p className="text-[15px] font-light leading-relaxed text-[#D7E2EA]/50 max-w-[280px] mx-auto">
            Thanks for reaching out. Ali will get back to you shortly.
          </p>
        </div>
      </div>
    );
  }

  const cleanWhatsapp = CONTACT.whatsapp.replace(/[^0-9]/g, '');

  if (view === 'selection') {
    return (
      <div className="my-4 relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0A0A0B]/80 backdrop-blur-2xl p-8 text-center sm:p-10 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] rounded-[100%] bg-[#C86BFF] opacity-[0.05] blur-[40px] pointer-events-none" />
        <h3 className="relative z-10 mb-8 text-lg font-light tracking-wide text-white">How would you like to connect?</h3>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-5">
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
    <div className="my-4 relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0A0A0B]/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-[#C86BFF] opacity-[0.04] blur-[50px] pointer-events-none -translate-y-1/2 translate-x-1/4" />
      
      <div className="relative z-10 mb-7 flex items-start justify-between">
        <div>
          <h3 className="mb-1.5 text-lg font-light tracking-wide text-white">Send a message</h3>
          <p className="text-[14px] font-light text-[#D7E2EA]/50">Fill out the form below and Ali will get back to you soon.</p>
        </div>
        <button 
          onClick={() => setView('selection')}
          className="rounded-full p-2 text-[#D7E2EA]/40 transition-colors hover:bg-white/[0.06] hover:text-white"
          aria-label="Back to selection"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#D7E2EA]/40 ml-1">
            Name
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            disabled={status === 'submitting'}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[15px] font-light text-white placeholder:text-[#D7E2EA]/20 focus:border-[#C86BFF]/40 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#C86BFF]/40 disabled:opacity-50 transition-all"
            placeholder="Jane Doe"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#D7E2EA]/40 ml-1">
            Email
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            disabled={status === 'submitting'}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[15px] font-light text-white placeholder:text-[#D7E2EA]/20 focus:border-[#C86BFF]/40 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#C86BFF]/40 disabled:opacity-50 transition-all"
            placeholder="jane@example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#D7E2EA]/40 ml-1">
            Message
          </label>
          <textarea
            required
            id="message"
            name="message"
            rows={4}
            disabled={status === 'submitting'}
            className="resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[15px] font-light text-white placeholder:text-[#D7E2EA]/20 focus:border-[#C86BFF]/40 focus:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-[#C86BFF]/40 disabled:opacity-50 transition-all"
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
          className="mt-3 flex h-[46px] items-center justify-center gap-2 rounded-xl bg-white font-medium text-black transition-all hover:bg-[#D7E2EA] hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed disabled:opacity-70 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 size={18} className="animate-spin text-[#C86BFF]" /> <span className="font-light">Sending...</span>
            </>
          ) : (
            <span className="font-medium tracking-wide">Send Message</span>
          )}
        </button>
      </form>
    </div>
  );
}
