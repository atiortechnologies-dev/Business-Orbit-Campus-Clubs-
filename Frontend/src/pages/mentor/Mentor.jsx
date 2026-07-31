import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail, Video, Loader2 } from 'lucide-react';
import MentorShell from '@/components/mentor/MentorShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getRecentRequests, getUpcomingMeetings, getRecentChats } from '@/api/dashboardApi';

const STATS = [
  { label: 'Active Students', value: '12', progress: 60 },
  { label: 'Pending Requests', value: '05', sub: 'Requires attention', dot: true },
  { label: 'Upcoming Meetings', value: '03', sub: 'Next: 2:00 PM today' },
  { label: 'Completed Sessions', value: '45', sub: '+8 this month' },
];

export default function MentorPage() {
  useDocumentTitle('Mentor Dashboard — BOCC');
  const [requests, setRequests] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reqs, meets, chats, recs] = await Promise.all([
          getRecentRequests(),
          getUpcomingMeetings(),
          getRecentChats(),
          import('@/api/axiosInstance').then(m => m.default.get('/recommendations').catch(() => null))
        ]);
        setRequests(reqs?.data || []);
        setMeetings(meets?.data || []);
        setConversations(chats?.data || []);
        if (recs && recs.data) {
          setRecommendations(Array.isArray(recs.data) ? recs.data : []);
        }
      } catch (err) {
        console.error('Failed to fetch mentor dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // TODO(backend): POST the accept/decline decision for this mentorship
  // request ({ requestId: id, decision: 'accepted' | 'declined' }); keep
  // the optimistic local removal on success, surface an error and leave
  // the request in place on failure.
  const handleAccept = (id) => setRequests((prev) => prev.filter((r) => r.id !== id));
  const handleDecline = (id) => setRequests((prev) => prev.filter((r) => r.id !== id));

  return (
    <MentorShell>
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading mb-2">
            Welcome back, Priya
          </h1>
          <p className="font-inter text-body text-text-muted">
            Here&apos;s an overview of your mentorship activities today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/mentor/chats"
            className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-poppins font-semibold text-small px-4 py-2.5 rounded-md hover:bg-canvas-bg transition-colors"
          >
            <MessageSquare size={16} strokeWidth={2} />
            Open Chats
          </Link>
          <Link
            to="/mentor/requests"
            className="inline-flex items-center gap-2 bg-action-bg text-action-text font-poppins font-semibold text-small px-4 py-2.5 rounded-md hover:opacity-90 transition-all"
          >
            <Mail size={16} strokeWidth={2} />
            View Requests
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <p className="font-inter font-medium text-caption uppercase tracking-wider text-text-muted mb-2">{stat.label}</p>
            <p className="font-poppins font-semibold text-section text-text-heading">{stat.value}</p>
            {stat.sub && (
              <p className="mt-1 flex items-center gap-1.5 font-inter text-small text-text-muted">
                {stat.dot && <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />}
                {stat.sub}
              </p>
            )}
            {stat.progress && (
              <div className="mt-3 w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-black h-full rounded-full" style={{ width: `${stat.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-poppins font-semibold text-card text-text-heading">Recent Mentorship Requests</h2>
            <Link to="/mentor/requests" className="font-inter text-small font-medium text-text-body hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="animate-spin text-text-muted" size={24} />
            </div>
          ) : requests.length === 0 ? (
            <p className="font-inter text-small text-text-muted py-6 text-center">No pending requests right now.</p>
          ) : (
            <div className="flex flex-col gap-4">

              {requests.map((req) => (
                <div key={req.id} className="flex items-center gap-3 pb-4 border-b border-border-subtle last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-poppins font-semibold text-small text-text-heading truncate">{req.name}</p>
                    <p className="font-inter text-caption text-text-muted truncate">{req.role}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDecline(req.id)}
                      className="font-inter font-medium text-caption uppercase tracking-wide text-text-body border border-border-subtle px-3 py-1.5 rounded-md hover:bg-canvas-bg transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccept(req.id)}
                      className="font-inter font-medium text-caption uppercase tracking-wide bg-action-bg text-action-text px-3 py-1.5 rounded-md hover:opacity-90 transition-all"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 flex items-center justify-between mb-4">
            <h2 className="font-poppins font-semibold text-card text-text-heading">Recommended Startups</h2>
          </div>
          <div className="flex flex-col gap-4">
            {recommendations.length === 0 && !loading ? (
               <p className="font-inter text-small text-text-muted text-center py-2">No recommendations available.</p>
            ) : (
               recommendations.map((rec) => (
                 <div key={rec._id || rec.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center font-bold text-xs">{String(rec.startup_name || rec.name || 'S')[0]}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-poppins font-semibold text-small text-text-heading truncate">{rec.startup_name || rec.name}</p>
                      <p className="font-inter text-caption text-text-muted truncate">{rec.industry || 'Tech'}</p>
                    </div>
                 </div>
               ))
            )}
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">Upcoming Meetings</h2>
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="animate-spin text-text-muted" size={24} />
                </div>
              ) : meetings.length === 0 ? (
                <p className="font-inter text-small text-text-muted text-center py-4">No upcoming meetings.</p>
              ) : (
                meetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-md bg-canvas-bg border border-border-subtle flex flex-col items-center justify-center shrink-0">
                      <span className="font-inter text-[10px] font-semibold uppercase text-text-muted leading-none">{meeting.month}</span>
                      <span className="font-poppins font-bold text-small text-text-heading leading-none mt-0.5">{meeting.day}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-poppins font-semibold text-small text-text-heading">{meeting.title}</p>
                      <p className="font-inter text-caption text-text-muted">{meeting.time}</p>
                      <p className="font-inter text-caption text-text-muted flex items-center gap-1 mt-0.5">
                        <Video size={12} strokeWidth={2} /> {meeting.location}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          <div className="bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <h2 className="font-poppins font-semibold text-card text-text-heading mb-4">Recent Conversations</h2>
            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="animate-spin text-text-muted" size={24} />
                </div>
              ) : conversations.length === 0 ? (
                <p className="font-inter text-small text-text-muted text-center py-4">No recent conversations.</p>
              ) : (
                conversations.map((conv) => (
                  <div key={conv.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-canvas-bg border border-border-subtle shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-poppins font-semibold text-caption text-text-heading truncate">{conv.name}</p>
                      <p className="font-inter text-caption text-text-muted truncate">{conv.preview}</p>
                    </div>
                    <span className="font-inter text-caption text-text-muted shrink-0">{conv.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </MentorShell>
  );
}
