import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Plus } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const INITIAL_MESSAGES = [
  { id: 1, from: 'them', text: 'Thanks for sending over the deck, this looks promising. I liked the traction slide in particular.', time: '10:12 AM' },
  { id: 2, from: 'them', text: "I'd love to see the financial projections for the next two years when you get a chance.", time: '10:14 AM' },
  { id: 3, from: 'me', text: "Thank you! I'll put together the projections and send them over by tomorrow.", time: '10:20 AM' },
];

export default function InvestorConversationPage() {
  useDocumentTitle('Marcus Thorne — Chat — BOCC');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages((prev) => [...prev, { id: prev.length + 1, from: 'me', text: input.trim(), time: 'Now' }]);
    setInput('');
    // TODO(backend): send message to a real-time chat service.
  };

  return (
    <DashboardShell pageId="investor-conversation">
      <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card overflow-hidden h-[calc(100vh-220px)] min-h-[500px] flex">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <Link to="/mentors/messages" className="p-1 -ml-1 text-text-muted hover:text-text-heading transition-colors">
                <ArrowLeft size={18} strokeWidth={2} />
              </Link>
              <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-small text-text-muted shrink-0">MT</div>
              <div>
                <p className="font-poppins font-semibold text-small text-text-heading">Marcus Thorne</p>
                <p className="font-inter text-caption text-text-muted">Atlas Ventures · <span className="text-text-heading font-medium italic">Interested in your pitch</span></p>
              </div>
            </div>
            <Badge variant="brand">Pitch Sent</Badge>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
            <span className="self-center px-3 py-1 bg-canvas-bg rounded-full font-inter text-caption text-text-muted">Today</span>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.from === 'me' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-md rounded-lg px-4 py-2.5 font-inter text-small ${msg.from === 'me' ? 'bg-action-bg text-action-text' : 'bg-canvas-bg text-text-body'}`}>
                  {msg.text}
                </div>
                <span className="font-inter text-caption text-text-muted mt-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-6 py-4 border-t border-border-subtle">
            <ComingSoon label="Attach file" position="top" inline>
              <span className="block p-2 text-text-muted"><Plus size={18} strokeWidth={2} /></span>
            </ComingSoon>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
              placeholder="Type a message..."
              className="flex-1 bg-canvas-bg border border-border-subtle rounded-md px-3 py-2 font-inter text-small focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
            />
            <button type="button" onClick={handleSend} className="p-2.5 bg-action-bg text-action-text rounded-md hover:opacity-90 transition-all">
              <Send size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="hidden lg:flex w-72 border-l border-border-subtle flex-col p-6 shrink-0 overflow-y-auto">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-brand-black text-accent-neon flex items-center justify-center font-poppins font-bold text-card">MT</div>
          <p className="font-poppins font-semibold text-small text-text-heading text-center">Marcus Thorne</p>
          <p className="font-inter text-caption text-text-muted text-center mb-4">Managing Partner, Atlas Ventures</p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['Fintech', 'SaaS', 'DeepTech'].map((t) => <span key={t} className="px-2 py-1 bg-canvas-bg text-text-muted font-inter text-caption rounded border border-border-subtle">{t}</span>)}
          </div>
          <Link to="/investors/profile" className="w-full text-center py-2 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors">
            View Profile
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
