import { useMemo, useState } from 'react';
import { Search, Video, Clock, Calendar as CalendarIcon } from 'lucide-react';
import MentorShell from '@/components/mentor/MentorShell';
import ComingSoon from '@/components/ui/ComingSoon';
import Badge from '@/components/ui/Badge';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STATS = [
  { label: 'Upcoming Meetings', value: '08' },
  { label: "Today's Meetings", value: '02' },
  { label: 'Completed Sessions', value: '45' },
  { label: 'Pending Confirmations', value: '03' },
];

const MEETINGS = [
  {
    id: 1,
    name: 'Sarah Chen',
    startup: 'EcoValve',
    stage: 'Seed',
    title: 'GTM Strategy Review',
    status: 'Upcoming',
    date: 'Oct 28, 2023',
    time: '2:00 PM (60 min)',
    location: 'Google Meet',
    college: 'MIT',
    agenda: ['Review Q3 sales targets', 'Draft outbound sequence for Tier 1', 'Discuss hiring roadmap for SDRs'],
    studentNotes: "Hoping to get specific feedback on our pricing tiers for the new enterprise tier we're launching next month.",
  },
  {
    id: 2,
    name: 'Marcus Thorne',
    startup: 'GridLogic',
    stage: 'Pre-Seed',
    title: 'Product Roadmap Deep-dive',
    status: 'Upcoming',
    date: 'Oct 30, 2023',
    time: '10:30 AM (45 min)',
    location: 'Google Meet',
    college: 'Oxford University',
    agenda: ['Walk through Q1 roadmap', 'Review technical architecture decisions'],
    studentNotes: 'Would like input on prioritizing the API integration versus the mobile app.',
  },
];

const OUTCOME_OPTIONS = ['Select outcome...', 'Great progress', 'Needs follow-up', 'Blocked / needs help', 'Session completed'];

export default function MentorMeetingsPage() {
  useDocumentTitle('Meetings — BOCC');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeetingId, setSelectedMeetingId] = useState(MEETINGS[0].id);
  const [mentorNotes, setMentorNotes] = useState('');
  const [outcome, setOutcome] = useState(OUTCOME_OPTIONS[0]);
  const [saved, setSaved] = useState(false);

  const selectedMeeting = MEETINGS.find((m) => m.id === selectedMeetingId);

  const filteredMeetings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MEETINGS;
    return MEETINGS.filter((m) => m.name.toLowerCase().includes(q) || m.startup.toLowerCase().includes(q));
  }, [searchQuery]);

  const handleSaveNotes = () => {
    // TODO(backend): persist mentorNotes/outcome for this meeting.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <MentorShell>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-poppins font-bold text-section text-text-heading mb-1">Meetings</h1>
          <p className="font-inter text-body text-text-muted">Manage your mentorship sessions and upcoming meetings.</p>
        </div>
        <div className="flex items-center gap-3">
          <ComingSoon label="Calendar View" position="top" inline className="inline-flex items-center gap-2 border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2 rounded-md">
            <CalendarIcon size={16} strokeWidth={2} />
            Calendar View
          </ComingSoon>
          <ComingSoon label="Schedule Meeting" position="top" inline className="inline-flex items-center gap-2 bg-action-bg text-action-text font-poppins font-semibold text-small px-4 py-2 rounded-md">
            <CalendarIcon size={16} strokeWidth={2} />
            Schedule Meeting
          </ComingSoon>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-surface-white border border-border-subtle rounded-lg p-5 shadow-card">
            <p className="font-inter font-medium text-caption uppercase tracking-wider text-text-muted mb-1">{stat.label}</p>
            <p className="font-poppins font-semibold text-section text-text-heading">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative">
            <Search size={16} strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student or startup..."
              className="w-full bg-surface-white border border-border-subtle rounded-md pl-9 pr-3 py-2.5 font-inter text-small focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
            />
          </div>

          <div className="flex flex-col gap-3">
            {filteredMeetings.map((meeting) => (
              <button
                key={meeting.id}
                type="button"
                onClick={() => setSelectedMeetingId(meeting.id)}
                className={`text-left bg-surface-white border rounded-lg shadow-card p-4 transition-colors ${
                  meeting.id === selectedMeetingId ? 'border-brand-black' : 'border-border-subtle hover:border-text-muted'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-poppins font-semibold text-small text-text-heading truncate">
                        {meeting.name} &bull; {meeting.startup}
                      </span>
                      <Badge variant="neutral" className="shrink-0">{meeting.stage}</Badge>
                    </div>
                    <p className="font-inter text-small text-text-body mb-1">{meeting.title}</p>
                    <Badge variant="info" className="mb-2">{meeting.status}</Badge>
                    <p className="font-inter text-caption text-text-muted flex items-center gap-1">
                      <CalendarIcon size={11} strokeWidth={2} /> {meeting.date}
                    </p>
                    <p className="font-inter text-caption text-text-muted flex items-center gap-1">
                      <Clock size={11} strokeWidth={2} /> {meeting.time}
                    </p>
                    <p className="font-inter text-caption text-text-muted flex items-center gap-1">
                      <Video size={11} strokeWidth={2} /> {meeting.location}
                    </p>
                  </div>
                </div>
                <ComingSoon label="Join Meeting" position="top" inline={false} className="mt-3 flex items-center justify-center bg-action-bg text-action-text font-poppins font-semibold text-caption px-3 py-2 rounded-md">
                  Join Meeting
                </ComingSoon>
              </button>
            ))}
          </div>
        </div>

        {selectedMeeting && (
          <div className="lg:col-span-7 bg-surface-white border border-border-subtle rounded-xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-subtle">
              <div className="w-12 h-12 rounded-full bg-canvas-bg border border-border-subtle shrink-0" />
              <div>
                <p className="font-poppins font-semibold text-card text-text-heading">{selectedMeeting.name}</p>
                <p className="font-inter text-small text-text-muted">{selectedMeeting.college} &bull; {selectedMeeting.startup}</p>
                <Badge variant="neutral" className="mt-1">{selectedMeeting.stage} Stage</Badge>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <ComingSoon label="Profile" position="top" inline className="flex-1 flex items-center justify-center bg-action-bg text-action-text font-poppins font-semibold text-small px-4 py-2.5 rounded-md">
                Profile
              </ComingSoon>
              <ComingSoon label="Chat" position="top" inline className="flex-1 flex items-center justify-center border border-border-subtle text-text-heading font-inter font-medium text-small px-4 py-2.5 rounded-md">
                Chat
              </ComingSoon>
            </div>

            <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2">Agenda</p>
            <ul className="list-disc list-inside font-inter text-small text-text-body mb-4 space-y-1">
              {selectedMeeting.agenda.map((item) => <li key={item}>{item}</li>)}
            </ul>

            <p className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2">Student Notes</p>
            <p className="font-inter text-small text-text-body italic mb-6">&quot;{selectedMeeting.studentNotes}&quot;</p>

            <label className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2 block">Mentor Notes</label>
            <textarea
              value={mentorNotes}
              onChange={(e) => setMentorNotes(e.target.value)}
              placeholder="Take notes during the session..."
              rows={4}
              className="w-full bg-canvas-bg border border-border-subtle rounded-md p-3 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all resize-none mb-4"
            />

            <label className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted mb-2 block">Meeting Outcome</label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full bg-canvas-bg border border-border-subtle rounded-md px-3 py-2.5 font-inter text-small text-text-body focus:outline-none focus:ring-1 focus:ring-brand-black transition-all mb-6"
            >
              {OUTCOME_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            <div className="flex items-center gap-3">
              {saved && <span className="font-inter text-small text-success">Saved</span>}
              <button type="button" onClick={handleSaveNotes} className="bg-action-bg text-action-text font-poppins font-semibold text-small px-5 py-2.5 rounded-md hover:opacity-90 transition-all">
                Save Notes
              </button>
              <ComingSoon label="Schedule Follow-up" position="top" inline className="border border-border-subtle text-text-heading font-inter font-medium text-small px-5 py-2.5 rounded-md">
                Schedule Follow-up
              </ComingSoon>
            </div>
          </div>
        )}
      </div>
    </MentorShell>
  );
}
