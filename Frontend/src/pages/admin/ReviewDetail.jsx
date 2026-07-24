import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Rocket,
  Globe,
  Presentation,
  FileText,
  FileSpreadsheet,
  FileArchive,
  Download,
  Calendar,
  History,
} from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Badge from '@/components/ui/Badge';
import ComingSoon from '@/components/ui/ComingSoon';
import Modal from '@/components/ui/Modal';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const TIMELINE = [
  { label: 'Idea', date: 'Aug 12, 2024', status: 'done' },
  { label: 'Validation', date: 'Sep 05, 2024', status: 'done' },
  { label: 'MVP', date: 'Current', status: 'active' },
  { label: 'Growth', date: 'TBD', status: 'pending' },
];

const FILES = [
  { name: 'user_interviews_raw.pdf', size: '4.2 MB', icon: FileText },
  { name: 'market_analysis_q3.xlsx', size: '1.8 MB', icon: FileSpreadsheet },
  { name: 'prototype_screens_v1.zip', size: '28.5 MB', icon: FileArchive },
];

const PREVIOUS_REVIEWS = [
  { stage: 'Validation', date: 'Sep 05, 2024', reviewer: 'Priya Sharma', outcome: 'Approved', note: 'Strong evidence of problem/solution fit from 120 survey responses.' },
  { stage: 'Idea', date: 'Aug 12, 2024', reviewer: 'Alex Rivera', outcome: 'Approved', note: 'Clear value proposition; encouraged to narrow initial target segment.' },
];

export default function ReviewDetailPage() {
  useDocumentTitle('Review: Luminara AI — BOCC Admin');
  const navigate = useNavigate();
  const [revisionRequested, setRevisionRequested] = useState(false);
  const [previousReviewsOpen, setPreviousReviewsOpen] = useState(false);

  return (
    <AdminShell>
      <nav className="mb-6 flex items-center gap-2 text-text-muted font-inter text-small">
        <Link to="/admin/reviews" className="hover:text-text-heading transition-colors">Stage Approval Queue</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Review: Luminara AI</span>
      </nav>

      {revisionRequested && (
        <div className="mb-6 p-4 rounded-lg border border-warning/30 bg-warning/10 text-warning font-inter text-small">
          A revision request has been logged for Luminara AI.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-lg bg-brand-black text-white flex items-center justify-center shrink-0">
                <Rocket size={22} strokeWidth={2} />
              </div>
              <div>
                <h1 className="font-poppins font-semibold text-card text-text-heading">Luminara AI</h1>
                <Badge variant="brand" className="mt-1">Stage: MVP</Badge>
              </div>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-4 border-t border-divider-line">
              <div>
                <dt className="font-inter text-caption text-text-muted uppercase">Founder</dt>
                <dd className="font-inter font-medium text-small text-text-heading">Sarah Jenkins</dd>
              </div>
              <div>
                <dt className="font-inter text-caption text-text-muted uppercase">Chapter</dt>
                <dd className="font-inter font-medium text-small text-text-heading">Silicon Valley Hub</dd>
              </div>
              <div>
                <dt className="font-inter text-caption text-text-muted uppercase">Mentor</dt>
                <dd className="font-inter font-medium text-small text-text-heading">Dr. Michael Chen</dd>
              </div>
            </dl>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-6">Progress Timeline</h3>
            <div className="relative flex justify-between">
              <div className="absolute top-4 left-0 right-0 h-px bg-border-subtle" />
              {TIMELINE.map(({ label, date, status }) => (
                <div key={label} className="relative z-10 flex flex-col items-center gap-2 text-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface-white ${
                      status === 'done' ? 'bg-success text-white' : status === 'active' ? 'bg-brand-black text-white' : 'bg-canvas-bg border border-border-subtle text-text-muted'
                    }`}
                  >
                    {status === 'active' && <div className="w-2 h-2 rounded-full bg-accent-neon" />}
                  </div>
                  <p className={`font-inter font-medium text-caption ${status === 'pending' ? 'text-text-muted' : 'text-text-heading'}`}>{label}</p>
                  <p className="font-inter text-caption text-text-muted">{date}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ComingSoon label="View MVP Resources" position="top" className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
              <Globe size={20} strokeWidth={2} className="text-text-muted mb-3" />
              <h4 className="font-poppins font-semibold text-body text-text-heading mb-1">MVP Links</h4>
              <p className="font-inter text-small text-text-muted mb-3">Prototype URL &amp; staging environment.</p>
              <span className="font-inter font-semibold text-small text-text-heading">View Resources →</span>
            </ComingSoon>
            <ComingSoon label="Open Pitch Deck" position="top" className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
              <Presentation size={20} strokeWidth={2} className="text-text-muted mb-3" />
              <h4 className="font-poppins font-semibold text-body text-text-heading mb-1">Pitch Deck</h4>
              <p className="font-inter text-small text-text-muted mb-3">Finalized investor deck v2.4.</p>
              <span className="font-inter font-semibold text-small text-text-heading">Open Deck →</span>
            </ComingSoon>
          </div>

          <section className="bg-surface-white border border-border-subtle rounded-lg shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border-subtle bg-canvas-bg/50 flex items-center justify-between">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Uploaded Evidence Files</h3>
              <ComingSoon label="Download All" position="top" inline>
                <span className="font-inter font-medium text-small text-text-body">Download All</span>
              </ComingSoon>
            </div>
            <div className="divide-y divide-border-subtle">
              {FILES.map(({ name, size, icon: Icon }) => (
                <div key={name} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-canvas-bg text-text-muted flex items-center justify-center shrink-0">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-medium text-small text-text-heading truncate">{name}</p>
                    <p className="font-inter text-caption text-text-muted">{size}</p>
                  </div>
                  <ComingSoon label={`Download ${name}`} position="top" inline>
                    <span className="p-2 text-text-muted rounded-md"><Download size={16} strokeWidth={2} /></span>
                  </ComingSoon>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-4">Quick Information</h3>
            <div className="flex items-center justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-border-subtle)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="44" fill="none" stroke="var(--color-brand-black)" strokeWidth="10"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - 0.6)}`}
                  strokeLinecap="round"
                />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="rotate-90" style={{ transform: 'rotate(90deg)', transformOrigin: '50px 50px', fill: 'var(--color-text-heading)', fontSize: '18px', fontWeight: 700, fontFamily: 'Poppins' }}>
                  60%
                </text>
              </svg>
            </div>
            <p className="text-center font-inter text-caption text-text-muted mb-4">Startup Progress</p>
            <dl className="space-y-3 pt-4 border-t border-divider-line">
              <div className="flex justify-between">
                <dt className="font-inter text-small text-text-muted">Submission Date</dt>
                <dd className="font-inter font-medium text-small text-text-heading">Oct 24, 2024</dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="font-inter text-small text-text-muted">Previous Status</dt>
                <dd><Badge variant="warning">Pending Clarification</Badge></dd>
              </div>
            </dl>
            <blockquote className="mt-4 pt-4 border-t border-divider-line font-inter text-small text-text-body italic">
              "Strong technical foundation, needs clearer go-to-market timeline before Traction review."
            </blockquote>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-6 shadow-card space-y-2">
            <h3 className="font-poppins font-semibold text-body text-text-heading mb-2">Quick Actions</h3>
            <button
              type="button"
              onClick={() => navigate('/admin/reviews/schedule-meeting')}
              className="w-full flex items-center gap-2 py-2.5 px-3 border border-border-subtle rounded-md font-inter font-medium text-small text-text-heading hover:bg-canvas-bg transition-colors"
            >
              <Calendar size={16} strokeWidth={2} /> Schedule Meeting
            </button>
            <ComingSoon label="Download All Files" position="top" inline={false}>
              <span className="w-full flex items-center gap-2 py-2.5 px-3 border border-border-subtle rounded-md font-inter font-medium text-small text-text-heading">
                <Download size={16} strokeWidth={2} /> Download All Files
              </span>
            </ComingSoon>
            <button
              type="button"
              onClick={() => setPreviousReviewsOpen(true)}
              className="w-full flex items-center gap-2 py-2.5 px-3 border border-border-subtle rounded-md font-inter font-medium text-small text-text-heading hover:bg-canvas-bg transition-colors"
            >
              <History size={16} strokeWidth={2} /> View Previous Reviews
            </button>
          </section>

          <section className="border-2 border-dashed border-border-subtle rounded-lg p-6">
            <h3 className="font-poppins font-semibold text-caption text-text-muted uppercase tracking-wider mb-4">Internal Admin Action</h3>
            <div className="space-y-2">
              <button
                type="button"
                // TODO(backend): POST a revision request for this submission.
                onClick={() => setRevisionRequested(true)}
                className="w-full py-2.5 border border-error text-error rounded-md font-poppins font-semibold text-small hover:bg-error/5 transition-colors"
              >
                Request Revision
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/reviews/workspace')}
                className="w-full py-2.5 bg-brand-black text-white rounded-md font-poppins font-semibold text-small hover:opacity-90 transition-opacity"
              >
                Begin Evaluation
              </button>
            </div>
          </section>
        </div>
      </div>

      <Modal isOpen={previousReviewsOpen} onClose={() => setPreviousReviewsOpen(false)} title="Previous Reviews — Luminara AI">
        <div className="space-y-4">
          {PREVIOUS_REVIEWS.map(({ stage, date, reviewer, outcome, note }) => (
            <div key={stage} className="border border-border-subtle rounded-lg p-4">
              <div className="flex items-center justify-between mb-1.5">
                <Badge variant="brand">{stage}</Badge>
                <span className="font-inter text-caption text-text-muted">{date}</span>
              </div>
              <p className="font-inter font-semibold text-small text-text-heading">{reviewer} · {outcome}</p>
              <p className="font-inter text-small text-text-muted mt-1">{note}</p>
            </div>
          ))}
        </div>
      </Modal>
    </AdminShell>
  );
}
