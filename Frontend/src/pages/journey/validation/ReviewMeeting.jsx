import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, ListChecks, FileText, Clock, ChevronRight, CheckCircle2, Send } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const AGENDA = [
  { title: 'Evidence Review', desc: 'Walk through your survey data and interview findings.' },
  { title: 'Pivot / Persevere Decision', desc: 'Discuss whether the data supports your current direction.' },
  { title: 'Next Steps', desc: 'Roadmap and deliverables for the MVP stage.' },
];

const DOCUMENTS = ['Customer_Interview_Transcripts.zip', 'Survey_Results_Data_Visualization.pdf', 'Final_Validation_Report.pdf'];

const TIMELINE = [
  { label: 'Report submitted for review', time: '2 days ago' },
  { label: 'Reviewer assigned', time: '1 day ago' },
  { label: 'Meeting scheduled', time: '4 hours ago' },
];

export default function ValidationReviewMeetingPage() {
  useDocumentTitle('Review Meeting — BOCC');

  const [notes, setNotes] = useState([
    { author: 'Marcus (Project Lead)', text: 'Please have your raw survey export ready to share on screen.' },
  ]);
  const [draft, setDraft] = useState('');
  const [meetingStatus, setMeetingStatus] = useState(null);

  const addNote = () => {
    if (!draft.trim()) return;
    setNotes((prev) => [...prev, { author: 'You', text: draft.trim() }]);
    setDraft('');
  };

  return (
    <DashboardShell pageId="validation-review-meeting">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/validation" className="hover:text-text-heading transition-colors">Validation</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Review Meeting</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Review Meeting</h1>
      <p className="font-inter text-body text-text-body mb-6">
        Finalize your Stage 2 progress with your assigned reviewer.
      </p>

      {meetingStatus && (
        <div className={`mb-6 flex items-center gap-2 rounded-lg border px-4 py-3 font-inter text-small ${
          meetingStatus === 'confirmed'
            ? 'bg-success/10 border-success/30 text-success'
            : 'bg-warning/10 border-warning/30 text-warning'
        }`}>
          <CheckCircle2 size={16} strokeWidth={2} />
          {meetingStatus === 'confirmed' ? 'Meeting confirmed — see you there.' : 'Reschedule requested — the team will follow up by email.'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider">Reviewer</p>
                <p className="font-poppins font-semibold text-body text-text-heading">Priya Nair — Stage 2 Reviewer</p>
                <p className="flex items-center gap-1.5 font-inter text-small text-text-muted mt-0.5">
                  <Video size={14} strokeWidth={2} /> Online — Google Meet
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-poppins font-bold text-card text-text-heading">Oct 28</p>
                <p className="font-inter text-small text-text-muted">3:30 PM</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-divider-line">
              <button
                type="button"
                onClick={() => setMeetingStatus('confirmed')}
                className="flex-1 bg-action-bg text-action-text py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small"
              >
                Confirm Meeting
              </button>
              <button
                type="button"
                onClick={() => setMeetingStatus('reschedule')}
                className="flex-1 border border-border-subtle text-text-heading py-2.5 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small"
              >
                Request Reschedule
              </button>
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks size={18} strokeWidth={2} className="text-text-body" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">Agenda</h3>
            </div>
            <div className="space-y-4">
              {AGENDA.map(({ title, desc }, i) => (
                <div key={title} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0 font-inter text-caption text-text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className="font-poppins font-semibold text-small text-text-heading">{title}</p>
                    <p className="font-inter text-small text-text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Pre-Meeting Notes</h3>
            <div className="space-y-3 mb-4">
              {notes.map((n, i) => (
                <div key={i} className="bg-canvas-bg rounded-lg p-3">
                  <p className="font-poppins font-semibold text-caption text-text-heading">{n.author}</p>
                  <p className="font-inter text-small text-text-body mt-0.5">{n.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                placeholder="Add a note before the meeting..."
                className="flex-1 bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-small py-2 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
              <button
                type="button"
                onClick={addNote}
                aria-label="Send note"
                className="w-9 h-9 rounded-md bg-brand-black flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
              >
                <Send size={16} strokeWidth={2} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-3">Shared Documents</p>
            <div className="space-y-2">
              {DOCUMENTS.map((doc) => (
                <div key={doc} className="flex items-center gap-2.5">
                  <FileText size={16} strokeWidth={2} className="text-text-muted shrink-0" />
                  <p className="font-inter text-small text-text-body truncate">{doc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-3">Activity Timeline</p>
            <div className="space-y-3">
              {TIMELINE.map(({ label, time }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <Clock size={14} strokeWidth={2} className="text-text-muted shrink-0 mt-0.5" />
                  <div>
                    <p className="font-inter text-small text-text-body">{label}</p>
                    <p className="font-inter text-caption text-text-muted">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
