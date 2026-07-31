import { Link } from 'react-router-dom';
import { PartyPopper, FileText, Download, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import api from '@/api/axiosInstance';

export default function IncubationConfirmedPage() {
  useDocumentTitle('Incubation Confirmed — BOCC');

  const [summary, setSummary] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [incubatorContact, setIncubatorContact] = useState({ name: 'Marcus Thorne', email: 'contact@techscale.com', phone: '+1 555-0123' });

  useEffect(() => {
    api.get('/acceptance')
      .then(res => {
        const data = res.data || {};
        setSummary([
          { label: 'Startup Name', value: data.startupName || 'EcoSphere Analytics' },
          { label: 'Incubator Name', value: data.incubatorName || 'TechScale Accelerator' },
          { label: 'Program Name', value: data.programName || 'Growth Catalyst Phase 1' },
          { label: 'Acceptance Date', value: data.acceptanceDate || 'October 24, 2023' },
          { label: 'Program Duration', value: data.duration || '6 Months' },
        ]);
        if (data.contact) setIncubatorContact(data.contact);
      })
      .catch(err => console.error('Failed to fetch acceptance summary', err));

    api.get('/admission-documents')
      .then(res => {
        setDocuments(res.data?.documents || ['Incubation Acceptance Letter', 'Offer Letter', 'Program Handbook']);
      })
      .catch(err => console.error('Failed to fetch admission documents', err));
  }, []);

  return (
    <DashboardShell pageId="incubation-confirmed">
      <section className="text-center max-w-2xl mx-auto py-8 mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-black rounded-full mb-4">
          <PartyPopper size={28} strokeWidth={2} className="text-accent-neon" />
        </div>
        <h1 className="font-poppins font-semibold text-page text-text-heading mb-2">Congratulations!</h1>
        <h2 className="font-poppins font-semibold text-card text-text-muted mb-4">Your Startup Has Been Accepted for Incubation</h2>
        <p className="font-inter text-body text-text-body">
          Your startup has been accepted into the incubation program. We wish you success on your entrepreneurial journey.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-poppins font-semibold text-card text-text-heading">Acceptance Summary</h3>
              <span className="px-3 py-1 bg-canvas-bg text-text-muted font-inter text-caption rounded-full uppercase">Official Record</span>
            </div>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {summary.map(({ label, value }) => (
                <div key={label}>
                  <p className="font-inter text-caption text-text-muted mb-1">{label}</p>
                  <p className="font-inter font-semibold text-small text-text-heading">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-card text-text-heading mb-6">Acceptance Documents</h3>
            <div className="divide-y divide-border-subtle">
              {documents.map((doc, idx) => {
                const docName = typeof doc === 'string' ? doc : (doc.name || `Document ${idx + 1}`);
                const uploadedAt = typeof doc === 'string' ? 'Oct 24, 2023' : (doc.uploadedAt || 'Recently');
                return (
                  <div key={idx} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-canvas-bg rounded"><FileText size={18} strokeWidth={2} className="text-text-muted" /></div>
                      <div>
                        <p className="font-inter font-medium text-small text-text-heading">{docName}</p>
                        <p className="font-inter text-caption text-text-muted">Uploaded: {uploadedAt}</p>
                      </div>
                    </div>
                    <ComingSoon label={`Download ${docName}`} position="left" inline>
                      <span className="p-2 text-text-muted"><Download size={18} strokeWidth={2} /></span>
                    </ComingSoon>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marketplace acceptance is the trigger for the MVP journey's incubation-proof step. */}
          <div className="bg-brand-black text-white rounded-lg p-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-poppins font-semibold text-body">Next: log this with your Startup Journey</p>
              <p className="font-inter text-small opacity-80">Submit your incubation proof to unlock the next stage.</p>
            </div>
            <Link to="/build-startup/journey/mvp/incubation-proof" className="flex items-center gap-2 px-5 py-2.5 bg-accent-neon text-brand-black rounded-lg font-poppins font-semibold text-small shrink-0 hover:opacity-90 transition-all">
              Submit Proof <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6">
            <h4 className="font-poppins font-semibold text-body text-text-heading mb-4">Incubator Contact</h4>
            <div className="space-y-3 font-inter text-small">
              <div><p className="text-caption text-text-muted">Contact Person</p><p className="font-medium text-text-heading">{incubatorContact.name}</p></div>
              <div><p className="text-caption text-text-muted">Email</p><p className="font-medium text-text-heading">{incubatorContact.email}</p></div>
              <div><p className="text-caption text-text-muted">Phone</p><p className="font-medium text-text-heading">{incubatorContact.phone}</p></div>
            </div>
          </div>
          <div className="bg-canvas-bg border border-border-subtle rounded-lg p-4">
            <p className="font-inter text-small text-text-muted italic">Please keep your acceptance documents safe for future reference.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center border-t border-divider-line pt-10 mt-12">
        <ComingSoon label="Download Documents" position="top" inline>
          <span className="flex items-center gap-2 px-8 py-3 bg-brand-black text-white rounded-lg font-poppins font-semibold text-small">
            <Download size={18} strokeWidth={2} /> Download Documents
          </span>
        </ComingSoon>
        <Link to="/dashboard" className="flex items-center justify-center gap-2 px-8 py-3 border border-border-subtle rounded-lg font-poppins font-semibold text-small text-text-heading hover:bg-canvas-bg transition-colors">
          Back to Dashboard
        </Link>
      </div>
    </DashboardShell>
  );
}
