import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  UploadCloud,
  FileText,
  NotebookPen,
  Image as ImageIcon,
  Video,
  Brain,
  Users,
  BarChart3,
  ClipboardCheck,
} from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Input from '@/components/ui/Input';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import api from '@/api/axiosInstance';

const CHECKLIST = [
  { icon: FileText, label: 'Survey Results' },
  { icon: NotebookPen, label: 'Interview Notes' },
  { icon: ImageIcon, label: 'User Screenshots' },
  { icon: Video, label: 'Recorded Sessions' },
];

const REFLECTION_PROMPTS = [
  { id: 'liked', label: 'What did users like?', hint: 'Reflect on the high points of the user experience.' },
  { id: 'challenges', label: 'What challenges did users face?', hint: 'Identify friction points and confusion.' },
  { id: 'improvements', label: 'What improvements will you make?', hint: 'Outline your immediate action plan.' },
];

const TEXTAREA_CLASS =
  'w-full rounded-md border border-border-subtle bg-surface-white text-sm text-text-body font-inter p-3 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all';

export default function CustomerFeedbackUploadPage() {
  useDocumentTitle('Customer Feedback — BOCC');
  const [summary, setSummary] = useState({ total: '', positive: '', suggestions: '', issues: '' });
  const [reflection, setReflection] = useState({ liked: '', challenges: '', improvements: '' });
  const [documents, setDocuments] = useState([
    { id: 'doc-1', name: 'survey_results.pdf', type: 'Survey' },
    { id: 'doc-2', name: 'interview_notes.docx', type: 'Notes' }
  ]);

  const updateSummary = (field) => (e) => setSummary((prev) => ({ ...prev, [field]: e.target.value }));
  const updateReflection = (field) => (e) => setReflection((prev) => ({ ...prev, [field]: e.target.value }));

  const handleDeleteDocument = (docId) => {
    api.delete(`/traction/submission/document/${docId}`)
      .then(() => {
        setDocuments(prev => prev.filter(d => d.id !== docId));
      })
      .catch(err => console.error('Failed to delete document:', err));
  };

  return (
    <DashboardShell pageId="customer-feedback-upload">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/traction" className="hover:text-text-heading transition-colors">Traction</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Customer Feedback</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Customer Feedback</h1>
        <p className="font-inter text-body text-text-body max-w-2xl">
          Upload evidence showing how real users interacted with your product and what
          improvements they suggested.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left column: upload + summary */}
        <div className="lg:col-span-8 space-y-6">

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-6">
              Evidence Upload
            </h3>

            <ComingSoon label="Upload Evidence" position="top">
              <div className="border-2 border-dashed border-border-subtle rounded-xl p-12 flex flex-col items-center justify-center text-center hover:border-brand-black transition-all duration-300 bg-canvas-bg w-full">
                <UploadCloud size={40} strokeWidth={1.5} className="text-text-muted mb-4" />
                <h4 className="font-poppins font-semibold text-card text-text-heading mb-2">Drag &amp; Drop Files</h4>
                <p className="font-inter text-small text-text-muted mb-6 max-w-md">
                  Support for Survey Results, Feedback Documents, Screenshots, Interview Notes,
                  User Testing Reports, and Recorded Sessions.
                </p>
                <span className="inline-flex px-6 py-2 bg-brand-black text-white rounded-lg font-poppins font-semibold text-caption uppercase tracking-wider">
                  Select Files
                </span>
              </div>
            </ComingSoon>

            {documents.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-inter font-semibold text-caption text-text-heading uppercase tracking-wider mb-2">Uploaded Documents</h4>
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border border-border-subtle rounded-lg bg-surface-white">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-text-muted" />
                      <span className="font-inter text-small text-text-body">{doc.name}</span>
                    </div>
                    <button onClick={() => handleDeleteDocument(doc.id)} className="text-error hover:opacity-80 transition-opacity font-inter text-small">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <h4 className="font-inter font-semibold text-caption text-text-heading uppercase tracking-wider mb-4">
                Required Documents Checklist
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {CHECKLIST.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 p-3 border border-border-subtle rounded-lg bg-canvas-bg">
                    <Icon size={18} strokeWidth={2} className="text-text-muted" />
                    <span className="font-inter text-small text-text-body">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-6">
              Feedback Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="totalResponses"
                label="Total Responses"
                type="number"
                placeholder="e.g. 24"
                value={summary.total}
                onChange={updateSummary('total')}
              />
              <Input
                id="positiveFeedback"
                label="Positive Feedback (%)"
                placeholder="e.g. 75%"
                value={summary.positive}
                onChange={updateSummary('positive')}
              />
              <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                <label htmlFor="suggestions" className="text-caption font-medium text-text-heading font-inter">
                  Improvement Suggestions
                </label>
                <textarea
                  id="suggestions"
                  rows={3}
                  placeholder="List key areas users want improved..."
                  value={summary.suggestions}
                  onChange={updateSummary('suggestions')}
                  className={TEXTAREA_CLASS}
                />
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                <label htmlFor="issues" className="text-caption font-medium text-text-heading font-inter">
                  Critical Issues Identified
                </label>
                <textarea
                  id="issues"
                  rows={3}
                  placeholder="What are the absolute dealbreakers?"
                  value={summary.issues}
                  onChange={updateSummary('issues')}
                  className={TEXTAREA_CLASS}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right column: reflection + actions */}
        <div className="lg:col-span-4 space-y-6">

          <section className="bg-surface-white border-2 border-brand-black rounded-lg p-8">
            <h3 className="font-inter font-semibold text-caption text-text-heading uppercase tracking-wider mb-6 flex items-center gap-2">
              <Brain size={16} strokeWidth={2} />
              Reflection Section
            </h3>
            <div className="space-y-6">
              {REFLECTION_PROMPTS.map(({ id, label, hint }) => (
                <div key={id}>
                  <label htmlFor={id} className="font-inter font-semibold text-small text-text-heading block mb-1">
                    {label}
                  </label>
                  <p className="font-inter text-caption text-text-muted mb-2">{hint}</p>
                  <textarea
                    id={id}
                    rows={4}
                    value={reflection[id]}
                    onChange={updateReflection(id)}
                    className={TEXTAREA_CLASS}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col gap-3">
            <Link
              to="/build-startup/journey/traction/product-submission"
              className="w-full text-center bg-action-bg text-action-text px-6 py-4 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-base"
            >
              Save Feedback
            </Link>
            <Link
              to="/build-startup/journey/traction"
              className="w-full text-center border border-border-subtle bg-surface-white text-text-heading px-6 py-3 rounded-md hover:bg-canvas-bg transition-colors font-poppins font-semibold text-small"
            >
              Cancel &amp; Discard
            </Link>
          </div>
        </div>
      </div>

      {/* Validation standards footer strip */}
      <div className="mt-16 pt-10 border-t border-divider-line">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1">
            <h5 className="font-poppins font-semibold text-card text-text-heading">Validation Standards</h5>
            <p className="font-inter text-small text-text-muted mt-2">
              All uploaded data is analyzed by the Student Ideation Committee to ensure
              rigorous testing standards were met.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="border border-border-subtle rounded-xl bg-canvas-bg flex items-center justify-around p-8">
              <div className="w-16 h-16 border-2 border-brand-black rounded-full flex items-center justify-center bg-surface-white">
                <Users size={22} strokeWidth={2} className="text-brand-black" />
              </div>
              <div className="w-16 h-16 border-2 border-brand-black rounded-full flex items-center justify-center bg-surface-white">
                <BarChart3 size={22} strokeWidth={2} className="text-brand-black" />
              </div>
              <div className="w-16 h-16 border-2 border-brand-black rounded-full flex items-center justify-center bg-surface-white">
                <ClipboardCheck size={22} strokeWidth={2} className="text-brand-black" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
