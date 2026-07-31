import { Mail, MapPin, Share2, Send } from 'lucide-react';
import { useState } from 'react';
import ComingSoon from '@/components/ui/ComingSoon';
import api from '@/api/axiosInstance';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // 'idle', 'submitting', 'success', 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !message) return;
    setStatus('submitting');
    api.post('/enquiries', { email, message })
      .then(() => {
        setStatus('success');
        setEmail('');
        setMessage('');
      })
      .catch(() => setStatus('error'));
  };

  return (
    <section id="contact" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-text-heading">Get In Touch</h2>
          <p className="mt-3 font-inter text-body text-text-body max-w-xl">
            Have a question about the platform, a partnership idea, or need help
            getting started? Our team usually responds within 24 hours.
          </p>

          <div className="mt-8 space-y-4 max-w-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center shrink-0">
              <Mail size={16} strokeWidth={2} className="text-text-body" />
            </div>
            <div>
              <div className="font-inter text-caption text-text-muted">Email</div>
              <div className="font-poppins font-medium text-small text-text-heading">hello@bocc.co</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center shrink-0">
              <MapPin size={16} strokeWidth={2} className="text-text-body" />
            </div>
            <div>
              <div className="font-inter text-caption text-text-muted">Headquarters</div>
              <div className="font-poppins font-medium text-small text-text-heading">Innovation Hub, Global Campus Nexus</div>
            </div>
          </div>
        </div>

        {/* No real social accounts exist yet, and lucide-react has no brand
            logos to represent specific platforms honestly — a single
            generic "Follow us" stub says exactly as much as is true,
            rather than three icons implying specific (nonexistent)
            Twitter/LinkedIn/Instagram links. */}
          <div className="mt-8">
            <ComingSoon label="Follow us" position="top" inline className="inline-flex items-center gap-2 border border-border-subtle text-text-body px-4 py-2 rounded-full font-inter text-small">
              <Share2 size={14} strokeWidth={2} />
              Follow us
            </ComingSoon>
          </div>
        </div>
        
        <div>
          <form onSubmit={handleSubmit} className="bg-surface-white border border-border-subtle rounded-lg p-8 shadow-card flex flex-col gap-4">
            <h3 className="font-poppins font-semibold text-card text-text-heading">Send an Enquiry</h3>
            <div>
              <label htmlFor="email" className="block font-inter text-caption text-text-heading mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-3 border border-border-subtle rounded-md font-inter text-small focus:outline-none focus:border-brand-black"
                disabled={status === 'submitting'}
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-inter text-caption text-text-heading mb-1">Message</label>
              <textarea
                id="message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className="w-full p-3 border border-border-subtle rounded-md font-inter text-small resize-none focus:outline-none focus:border-brand-black"
                disabled={status === 'submitting'}
              />
            </div>
            {status === 'success' && <p className="text-accent-neon font-inter text-small font-medium">Message sent successfully!</p>}
            {status === 'error' && <p className="text-error font-inter text-small font-medium">Failed to send message. Please try again.</p>}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-2 h-11 w-full bg-brand-black text-white font-poppins font-semibold text-small rounded-md flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Send size={16} strokeWidth={2} />
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
