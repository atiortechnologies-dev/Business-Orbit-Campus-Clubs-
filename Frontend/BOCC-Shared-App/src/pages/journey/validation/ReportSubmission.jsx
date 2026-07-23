import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, BarChart3, Film, UploadCloud, AlertTriangle, ChevronRight } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const PROGRESS = [
  { label: 'Interviews', value: '24 / 20' },
  { label: 'Survey Samples', value: '156' },
  { label: 'MVP Tests', value: '3 Round' },
];

const EVIDENCE_LOG = [
  { icon: FileText, name: 'Customer_Interview_Transcripts.zip', meta: 'Uploaded Oct 12 · 4.2 MB' },
  { icon: BarChart3, name: 'Survey_Results_Data_Visualization.pdf', meta: 'Uploaded Oct 14 · 1.8 MB' },
  { icon: Film, name: 'MVP_User_Testing_Reactions.mp4', meta: 'Uploaded Oct 15 · 22.5 MB' },
];

const CHECKLIST = [
  'Hypothesis testing clearly documented',
  'Pivot or Persevere logic defined',
  'Target market size re-calculated',
  'Advisor feedback incorporated',
];

export default function ReportSubmissionPage() {
  useDocumentTitle('Validation Report Submission — BOCC');
  const navigate = useNavigate();

  const [checklist, setChecklist] = useState(CHECKLIST.map(() => false));
  const [declared, setDeclared] = useState(false);

  const toggleChecklist = (i) => setChecklist((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const handleSubmit = () => {
    // TODO(backend): POST the validation report + evidence log for final review.
    navigate('/build-startup/journey/validation/confirmation');
  };

  return (
    <DashboardShell pageId="validation-report-submission">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/validation" className="hover:text-text-heading transition-colors">Validation</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Report Submission</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Validation Report Submission</h1>
      <p className="font-inter text-body text-text-body mb-8 max-w-2xl">
        Submit your final findings and evidence for the Validation phase. Review all tasks
        carefully before final submission.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Validation Progress</h3>
              <span className="bg-success/10 text-success font-poppins font-semibold text-caption px-3 py-1 rounded-full">100% Complete</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {PROGRESS.map(({ label, value }) => (
                <div key={label} className="bg-canvas-bg border border-border-subtle rounded-lg p-4">
                  <p className="font-inter text-caption text-text-muted">{label}</p>
                  <p className="font-poppins font-semibold text-card text-text-heading mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Evidence Log</h3>
            <div className="space-y-2">
              {EVIDENCE_LOG.map(({ icon: Icon, name, meta }) => (
                <div key={name} className="flex items-center gap-3 border border-border-subtle rounded-lg p-3">
                  <Icon size={18} strokeWidth={2} className="text-text-muted shrink-0" />
                  <div className="min-w-0">
                    <p className="font-poppins font-semibold text-small text-text-heading truncate">{name}</p>
                    <p className="font-inter text-caption text-text-muted">{meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-6">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-1">Final Validation Report</h3>
            <p className="font-inter text-small text-text-muted mb-4">
              Combine your insights into a single comprehensive document. PDF format preferred.
            </p>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border-subtle rounded-lg py-10 cursor-pointer hover:border-text-muted transition-colors">
              <UploadCloud size={26} strokeWidth={1.5} className="text-text-muted" />
              <p className="font-poppins font-semibold text-small text-text-heading">Click to upload or drag and drop</p>
              <p className="font-inter text-caption text-text-muted">Maximum file size 50MB. (PDF, DOCX)</p>
              <input type="file" accept=".pdf,.docx" className="hidden" />
            </label>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Review Checklist</h3>
            <div className="space-y-3">
              {CHECKLIST.map((item, i) => (
                <label key={item} className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklist[i]}
                    onChange={() => toggleChecklist(i)}
                    className="w-4 h-4 mt-0.5 accent-brand-black shrink-0"
                  />
                  <span className={`font-inter text-small ${checklist[i] ? 'text-text-muted line-through' : 'text-text-body'}`}>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
            <div className="flex items-start gap-2.5 mb-4">
              <AlertTriangle size={18} strokeWidth={2} className="text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-poppins font-semibold text-small text-text-heading">Submission Policy</p>
                <p className="font-inter text-caption text-text-muted mt-0.5">
                  Submission cannot be edited while under review. Ensure all files are final.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={declared}
                onChange={() => setDeclared((v) => !v)}
                className="w-4 h-4 mt-0.5 accent-brand-black shrink-0"
              />
              <span className="font-inter text-small text-text-body">
                I declare that all information and evidence provided is accurate and my original work.
              </span>
            </label>

            <button
              type="button"
              disabled={!declared}
              onClick={handleSubmit}
              className="w-full bg-action-bg text-action-text py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
            >
              Submit for Review
            </button>
            <p className="font-inter text-caption text-text-muted text-center mt-3">
              Estimated review time: 3–5 business days.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
