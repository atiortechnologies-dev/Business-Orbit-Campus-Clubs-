import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, ListChecks, CalendarCheck, ChevronRight, User, CheckCircle2 } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import api from '@/api/axiosInstance';

export default function IdeationReviewMeetingPage() {
  useDocumentTitle('Review Meeting — BOCC');

  const [checklist, setChecklist] = useState({ review: false, questions: false });
  const [meetingStatus, setMeetingStatus] = useState(null);
  const [rubrics, setRubrics] = useState([]);

  useEffect(() => {
    api.get('/evaluations/rubric/ideation')
      .then(res => setRubrics(res.data?.criteria || []))
      .catch(err => console.error('Failed to fetch ideation rubric:', err));
  }, []);

  const toggleCheck = (item) => setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));

  return (
    <DashboardShell pageId="ideation-review-meeting">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/ideation" className="hover:text-text-heading transition-colors">Ideation</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Review Meeting</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Review Meeting</h1>
      <p className="font-inter text-body text-text-body mb-8">
        Finalize your Stage 1 progress with your assigned mentor.
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
        <div className="lg:col-span-5 bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-brand-black flex flex-col items-center justify-center text-white shrink-0">
              <span className="font-inter text-caption uppercase">Oct</span>
              <span className="font-poppins font-bold text-section leading-none">24</span>
            </div>
            <div>
              <p className="font-poppins font-semibold text-card text-text-heading">2:00 PM</p>
              <p className="font-inter text-small text-text-muted">GMT +1:00</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-divider-line">
            <div className="w-10 h-10 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0">
              <User size={18} strokeWidth={2} className="text-text-muted" />
            </div>
            <div>
              <p className="font-inter text-caption text-text-muted uppercase tracking-wider">Assigned Mentor</p>
              <p className="font-poppins font-semibold text-body text-text-heading">Jordan Blake — Ideation Mentor</p>
              <p className="flex items-center gap-1.5 font-inter text-small text-text-muted mt-0.5">
                <Video size={14} strokeWidth={2} /> Online — Zoom
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
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
              Reschedule
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks size={18} strokeWidth={2} className="text-text-body" />
              <h3 className="font-poppins font-semibold text-body text-text-heading">Evaluation Rubric</h3>
            </div>
            <div className="space-y-4">
              {rubrics.length > 0 ? (
                rubrics.map((criteriaItem, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-canvas-bg border border-border-subtle flex items-center justify-center shrink-0 font-inter text-caption text-text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="font-poppins font-semibold text-small text-text-heading">{criteriaItem.name || criteriaItem.title || 'Criteria'}</p>
                      <p className="font-inter text-small text-text-muted">{criteriaItem.description || criteriaItem.desc || ''}</p>
                      {criteriaItem.weight && <span className="text-[10px] uppercase font-semibold text-text-muted mt-1 inline-block bg-canvas-bg px-2 py-0.5 rounded">Weight: {criteriaItem.weight}%</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-inter text-small text-text-muted">Loading rubric criteria...</p>
              )}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Prep Checklist</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={checklist.review} onChange={() => toggleCheck('review')} className="w-4 h-4 accent-brand-black" />
                <span className={`font-inter text-small ${checklist.review ? 'text-text-muted line-through' : 'text-text-body'}`}>
                  Review your submission
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={checklist.questions} onChange={() => toggleCheck('questions')} className="w-4 h-4 accent-brand-black" />
                <span className={`font-inter text-small ${checklist.questions ? 'text-text-muted line-through' : 'text-text-body'}`}>
                  Prepare questions for the mentor
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-info/10 border border-info/30 rounded-lg p-4">
            <CalendarCheck size={20} strokeWidth={2} className="text-info shrink-0" />
            <p className="font-inter text-small text-text-body">
              Meeting invitation will be sent to your student email.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
