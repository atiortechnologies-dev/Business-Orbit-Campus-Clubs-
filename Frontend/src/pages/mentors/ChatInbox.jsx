import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const THREADS = [
  { id: 't1', name: 'Sarah Jenkins', sub: 'Mentor · Product Lead at VentureLabs', preview: "Also, take a look at the shared reference document for the pricing strategy.", time: '11:10 AM', href: '/mentors/chat', unread: 0 },
  { id: 't2', name: 'Marcus Thorne', sub: 'Investor · Atlas Ventures', preview: "I'd love to see the financial projections for the next two years.", time: '10:14 AM', href: '/investors/chat', unread: 2 },
  { id: 't3', name: 'Elena Rodriguez', sub: 'Mentor · Design Lead at Studio Alpha', preview: 'Thanks for the update! Looking forward to the demo.', time: 'Oct 24', href: null, unread: 0 },
  { id: 't4', name: 'Sarah Chen', sub: 'Investor · Oasis Capital', preview: 'Glad we could connect. Let\'s touch base next week.', time: 'Oct 22', href: null, unread: 0 },
];

export default function ChatInboxPage() {
  useDocumentTitle('Messages — BOCC');

  return (
    <DashboardShell pageId="chat-inbox">
      <div className="mb-6">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Messages</h1>
        <p className="font-inter text-body text-text-body">All your mentor and investor conversations in one place.</p>
      </div>

      <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card overflow-hidden divide-y divide-border-subtle">
        {THREADS.map((t) => {
          const row = (
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="w-12 h-12 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center font-poppins font-bold text-small text-text-muted shrink-0">
                {t.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-poppins font-semibold text-small text-text-heading truncate">{t.name}</p>
                  <span className="font-inter text-caption text-text-muted shrink-0">{t.time}</span>
                </div>
                <p className="font-inter text-caption text-text-muted">{t.sub}</p>
                <p className="font-inter text-small text-text-body truncate mt-0.5">{t.preview}</p>
              </div>
              {t.unread > 0 && <Badge variant="brand">{t.unread}</Badge>}
            </div>
          );

          return t.href ? (
            <Link key={t.id} to={t.href} className="block hover:bg-canvas-bg/50 transition-colors">
              {row}
            </Link>
          ) : (
            <ComingSoon key={t.id} label={`Open conversation with ${t.name}`} position="top" className="block w-full text-left">
              {row}
            </ComingSoon>
          );
        })}
      </div>

      {THREADS.every((t) => !t.href) && (
        <div className="text-center py-16">
          <MessageSquare size={32} strokeWidth={1.5} className="text-text-muted mx-auto mb-3" />
          <p className="font-inter text-small text-text-muted">No conversations yet.</p>
        </div>
      )}
    </DashboardShell>
  );
}
