import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileUp, File, Trash2, CheckCircle2, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const FORMATS = ['.PDF', '.DOCX', '.CSV', '.XLSX', '.MP4', '.PNG'];

const EXAMPLES = [
  { title: 'Problem Interviews', desc: 'Transcripts or recordings from at least 10 potential customers.' },
  { title: 'Landing Page Analytics', desc: 'Screenshots of traffic, click-through rates, and signup counts.' },
  { title: 'LOI / Pre-orders', desc: 'Signed Letters of Intent or transaction logs for early commitments.' },
];

export default function EvidenceUploadPage() {
  useDocumentTitle('Evidence Upload — BOCC');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');

  const addFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((f) => ({ name: f.name, size: f.size }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const canContinue = files.length > 0;

  const handleContinue = () => {
    if (!canContinue) return;
    // TODO(backend): upload `files` + `description` to the validation-evidence endpoint.
    navigate('/build-startup/journey/validation/report-submission');
  };

  return (
    <DashboardShell pageId="evidence-upload">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/validation" className="hover:text-text-heading transition-colors">Validation</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Evidence Upload</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Upload Validation Evidence</h1>
      <p className="font-inter text-body text-text-body mb-8 max-w-2xl">
        Demonstrate your progress by uploading interview logs, survey results, or market
        research data. This evidence helps mentors validate your Validation-stage milestones.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border-subtle rounded-lg py-14 text-center"
          >
            <FileUp size={32} strokeWidth={1.5} className="text-text-muted" />
            <p className="font-poppins font-semibold text-body text-text-heading">Drop files here to upload</p>
            <p className="font-inter text-small text-text-muted">Or click to browse your local directory</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small mt-2"
            >
              Select Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          <div>
            <label htmlFor="evidence-desc" className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider block mb-1.5">
              Context &amp; Description (Optional)
            </label>
            <textarea
              id="evidence-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what this evidence proves about your target market..."
              className="w-full bg-canvas-bg border border-border-subtle rounded-md text-text-body font-inter text-body py-2.5 px-3 focus:outline-none focus:ring-1 focus:ring-brand-black resize-none"
            />
          </div>

          {files.length > 0 && (
            <div>
              <p className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider mb-2">Active Uploads</p>
              <div className="space-y-2">
                {files.map(({ name }) => (
                  <div key={name} className="flex items-center gap-3 bg-surface-white border border-border-subtle rounded-lg p-3">
                    <File size={18} strokeWidth={2} className="text-text-muted shrink-0" />
                    <p className="font-inter font-medium text-small text-text-heading truncate flex-1">{name}</p>
                    <button type="button" onClick={() => removeFile(name)} aria-label={`Remove ${name}`}>
                      <Trash2 size={16} strokeWidth={2} className="text-text-muted hover:text-error transition-colors" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-5">
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-3">Supported Formats</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {FORMATS.map((f) => (
                <span key={f} className="bg-surface-white border border-border-subtle rounded-md px-2.5 py-1 font-inter text-caption text-text-body">{f}</span>
              ))}
            </div>
            <p className="font-inter text-caption text-text-muted">Max file size: 50MB per document.</p>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg shadow-card p-5">
            <p className="font-inter font-semibold text-caption text-text-muted uppercase tracking-wider mb-3">Evidence Examples</p>
            <div className="space-y-3">
              {EXAMPLES.map(({ title, desc }) => (
                <div key={title} className="flex gap-2.5">
                  <CheckCircle2 size={16} strokeWidth={2} className="text-text-muted shrink-0 mt-0.5" />
                  <div>
                    <p className="font-poppins font-semibold text-small text-text-heading">{title}</p>
                    <p className="font-inter text-caption text-text-muted mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-8 mt-8 border-t border-divider-line">
        <Link
          to="/build-startup/journey/validation/survey-tracker"
          className="flex items-center gap-2 font-inter text-small text-text-body hover:text-text-heading transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Milestones
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            // TODO(backend): persist as a draft against the student's account.
            className="font-poppins font-semibold text-small text-text-heading hover:opacity-80 transition-opacity"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 bg-action-bg text-action-text px-6 py-2.5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-small disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
