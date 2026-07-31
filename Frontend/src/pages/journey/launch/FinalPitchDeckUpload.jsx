import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Upload, UploadCloud, FileText, Video, History, CheckCircle2, MoreVertical, Film, PieChart, Trash } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import Button from '@/components/ui/Button';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getPitchDeck, uploadPitchDeck, deletePitchDeck, submitPitchDeck } from '@/api/startup/launchApi';

const MODULES = [
  { id: 'deck', title: 'Final Pitch Deck', required: true, icon: Upload, cta: <>Drag &amp; drop or <span className="underline">browse</span></>, formats: 'Supported formats: PDF, PPTX (max 50MB)' },
  { id: 'profile', title: 'Company Profile', required: false, icon: UploadCloud, cta: 'Upload Document', formats: 'Supported formats: PDF, DOCX (max 20MB)' },
  { id: 'onepager', title: 'One Pager', required: false, icon: FileText, cta: 'Upload One Pager', formats: 'Supported formats: PDF (max 5MB)' },
  { id: 'demo', title: 'Demo Video', required: false, icon: Video, cta: 'Upload MP4 Video', formats: 'Supported formats: MP4, MOV (max 100MB)' },
];

const MILESTONES = [
  { label: 'Venture Launch Plan', status: 'Completed • Oct 24, 2023', done: true },
  { label: 'Financial Modeling', status: 'Completed • Oct 12, 2023', done: true },
  { label: 'Pitch Review', status: 'Pending Graduation', done: false },
];

export default function FinalPitchDeckUploadPage() {
  useDocumentTitle('Final Pitch Deck Upload — BOCC');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getPitchDeck();
      if (data && data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to fetch pitch deck data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    try {
      await uploadPitchDeck(formData);
      fetchData();
    } catch (err) {
      console.error('Upload failed', err);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id) => {
    try {
      await deletePitchDeck(id);
      fetchData();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleContinue = async () => {
    try {
      await submitPitchDeck();
      navigate('/build-startup/journey/launch/proof-upload');
    } catch (err) {
      console.error('Submit failed', err);
    }
  };

  return (
    <DashboardShell pageId="final-pitch-deck-upload">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/launch" className="hover:text-text-heading transition-colors">Stage 5 – Launch</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Pitch Deck Upload</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Final Pitch Deck Upload</h1>
        <p className="font-inter text-body text-text-body">
          Upload your final investor-ready documents for graduation review.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <div className="lg:col-span-8 space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES.map(({ id, title, required, icon: Icon, cta, formats }) => (
              <div
                key={id}
                className={`bg-surface-white p-6 rounded-lg flex flex-col gap-4 border ${
                  required ? 'border-2 border-brand-black' : 'border-border-subtle'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-inter font-semibold text-caption text-text-heading uppercase tracking-tight">{title}</h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-poppins font-semibold ${
                      required ? 'bg-brand-black text-white' : 'bg-canvas-bg text-text-muted'
                    }`}
                  >
                    {required ? 'Required' : 'Optional'}
                  </span>
                </div>
                <ComingSoon label={title} position="top">
                  <div className="border-2 border-dashed border-border-subtle rounded-lg py-8 flex flex-col items-center justify-center bg-canvas-bg hover:bg-surface-white hover:border-brand-black transition-all cursor-pointer group w-full" onClick={() => fileInputRef.current?.click()}>
                    <Icon size={32} strokeWidth={1.5} className="text-text-muted group-hover:text-text-heading transition-colors mb-2" />
                    <p className="font-inter text-small text-text-body">{cta}</p>
                  </div>
                </ComingSoon>
                <p className="font-inter text-[11px] text-text-muted">{formats}</p>
              </div>
            ))}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} />
          </div>

          <section>
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-6 flex items-center gap-2">
              <History size={20} strokeWidth={2} className="text-text-heading" />
              Recently Uploaded
            </h4>
            <div className="bg-surface-white border border-border-subtle rounded-lg overflow-hidden">
              <table className="w-full border-collapse min-w-full">
                <thead className="bg-canvas-bg border-b border-border-subtle">
                  <tr>
                    <th className="text-left py-4 px-6 font-inter text-caption text-text-muted">File Name</th>
                    <th className="text-left py-4 px-6 font-inter text-caption text-text-muted">Size</th>
                    <th className="text-left py-4 px-6 font-inter text-caption text-text-muted">Status</th>
                    <th className="text-right py-4 px-6 font-inter text-caption text-text-muted">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {documents.length > 0 ? documents.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-canvas-bg transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <FileText size={18} strokeWidth={2} className="text-text-heading" />
                        <span className="font-inter text-small text-text-body">{doc.fileName || doc.name || 'Document'}</span>
                      </td>
                      <td className="py-4 px-6 font-inter text-small text-text-muted">{(doc.size / 1024 / 1024).toFixed(2)} MB</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-text-heading font-inter text-small">
                          <CheckCircle2 size={16} strokeWidth={2} />
                          Uploaded
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button type="button" onClick={() => handleDelete(doc._id || doc.id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash size={18} strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-4 px-6 text-center text-text-muted text-small">No documents uploaded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="pt-4 border-t border-divider-line flex justify-end gap-4">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleContinue}>Continue</Button>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">

          <div className="bg-surface-white border border-border-subtle p-5 rounded-lg">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="font-inter text-caption text-text-muted uppercase tracking-wider">Completion</p>
                <p className="font-poppins font-semibold text-card text-text-heading">95%</p>
              </div>
              <PieChart size={28} strokeWidth={2} className="text-text-heading" />
            </div>
            <div className="w-full bg-canvas-bg rounded-full h-2 overflow-hidden">
              <div className="bg-brand-black h-full rounded-full" style={{ width: '95%' }} />
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-inter font-semibold text-caption text-text-heading uppercase tracking-wider mb-6">
              Milestones History
            </h4>
            <div className="space-y-6 relative">
              <div className="absolute left-1.5 top-2 bottom-2 w-px bg-border-subtle" />
              {MILESTONES.map((item) => (
                <div key={item.label} className="relative flex items-start gap-4 pl-8">
                  <div
                    className={`absolute left-0 top-1 w-3 h-3 rounded-full ring-4 ring-surface-white ${
                      item.done ? 'bg-brand-black' : 'bg-canvas-bg border border-border-subtle'
                    }`}
                  />
                  <div>
                    <p className={`font-inter font-semibold text-small ${item.done ? 'text-text-heading' : 'text-text-muted'}`}>
                      {item.label}
                    </p>
                    <p className="font-inter text-[10px] text-text-muted">{item.status}</p>
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
