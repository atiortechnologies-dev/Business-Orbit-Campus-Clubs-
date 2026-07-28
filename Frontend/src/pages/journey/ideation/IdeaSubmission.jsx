import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UploadCloud, ChevronRight } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const FIELDS = [
  { name: 'startupName', label: 'Startup Name', type: 'input', placeholder: 'e.g. EcoSphere Analytics', hint: "Make it memorable and professional." },
  { name: 'problemStatement', label: 'Problem Statement', type: 'textarea', rows: 3, placeholder: 'What specific problem are you solving? Be concise.', hint: 'Focus on the pain points of your potential customers.' },
  { name: 'solution', label: 'Solution', type: 'textarea', rows: 3, placeholder: 'Explain your core offering and how it addresses the problem.', hint: 'Focus on the "How" and "What" of your startup.' },
  { name: 'targetAudience', label: 'Target Audience', type: 'textarea', rows: 2, placeholder: 'Who is your ideal customer? Define demographics or segments.' },
  { name: 'valueProposition', label: 'Value Proposition', type: 'textarea', rows: 2, placeholder: 'Why should customers choose you over others?' },
  { name: 'competitors', label: 'Competitors', type: 'textarea', rows: 2, placeholder: 'List existing alternatives and your competitive advantage.' },
];

export default function IdeaSubmissionPage() {
  useDocumentTitle('Submit Your Idea — BOCC');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startupName: '', problemStatement: '', solution: '',
    targetAudience: '', valueProposition: '', competitors: '', document: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, document: e.target.files[0] ?? null }));
  };

  const canSubmit =
    formData.startupName.trim().length > 0 &&
    formData.problemStatement.trim().length > 0 &&
    formData.solution.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO(backend): POST formData to the idea-submission endpoint for the
    // current student, then advance their Ideation-stage status server-side.
    navigate('/build-startup/journey/ideation/confirmation');
  };

  return (
    <DashboardShell pageId="idea-submission">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/ideation" className="hover:text-text-heading transition-colors">Ideation</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Submit Idea</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Submit Your Idea</h1>
      <p className="font-inter text-body text-text-body mb-8 max-w-2xl">
        Complete the following sections to detail your startup's core proposition.
        This data will be used for your Stage 1 review.
      </p>

      <form onSubmit={handleSubmit} className="max-w-3xl bg-surface-white border border-border-subtle rounded-lg shadow-card p-6 space-y-6">
        {FIELDS.map(({ name, label, type, placeholder, hint, rows }) => (
          <div key={name} className="space-y-1.5">
            <label htmlFor={name} className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider">
              {label}
            </label>
            {type === 'textarea' ? (
              <textarea
                id={name}
                name={name}
                rows={rows}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black resize-none"
              />
            ) : (
              <input
                id={name}
                name={name}
                type="text"
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black"
              />
            )}
            {hint && <p className="font-inter text-caption text-text-muted">{hint}</p>}
          </div>
        ))}

        <div className="space-y-1.5">
          <label className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block">
            Supporting Documents
          </label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border-subtle rounded-lg py-8 cursor-pointer hover:border-text-muted transition-colors">
            <UploadCloud size={28} strokeWidth={1.5} className="text-text-muted" />
            <p className="font-inter text-small text-text-body">Click to upload or drag and drop</p>
            <p className="font-inter text-caption text-text-muted">PDF, PNG, JPG (Max 10MB)</p>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
          </label>
          {formData.document && (
            <p className="font-inter text-small text-text-body">Selected: {formData.document.name}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-divider-line">
          <button
            type="button"
            // TODO(backend): persist this as a draft against the student's account.
            className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Idea
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}
