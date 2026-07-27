import { Link } from 'react-router-dom';
import { MapPin, Mail, Globe, Users, MessageCircle, Info } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import ComingSoon from '@/components/ui/ComingSoon';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const INTERESTS = ['Distributed Ledger Tech', 'Gen-AI Infrastructure', 'Sustainability SaaS', 'Education Tech'];
const PORTFOLIO = [
  { name: 'Luminara', tag: 'AI-Powered Compliance', desc: 'Enterprise-grade AI middleware for regulatory automated reporting in the EU and NA.' },
  { name: 'FlowState', tag: 'Fintech Infrastructure', desc: 'Real-time payment rails for B2B cross-border transactions using stablecoin architecture.' },
];

export default function InvestorProfilePage() {
  useDocumentTitle('Marcus Thorne — Investor Profile — BOCC');

  return (
    <DashboardShell pageId="investor-profile">
      <div className="bg-surface-white border border-border-subtle rounded-lg p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-32 h-32 rounded-lg bg-brand-black text-accent-neon flex items-center justify-center font-poppins font-bold text-page shrink-0">
            MT
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Marcus Thorne</h1>
                <p className="font-inter text-body text-text-muted">Managing Partner @ Atlas Ventures</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <ComingSoon label="Website" position="left" inline className="p-2 border border-border-subtle rounded-lg text-text-muted">
                  <Globe size={18} strokeWidth={2} />
                </ComingSoon>
                <ComingSoon label="LinkedIn" position="left" inline className="p-2 border border-border-subtle rounded-lg text-text-muted">
                  <Users size={18} strokeWidth={2} />
                </ComingSoon>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 mt-4 text-text-muted font-inter text-small">
              <span className="flex items-center gap-1"><MapPin size={16} strokeWidth={2} /> San Francisco, CA</span>
              <span className="flex items-center gap-1"><Mail size={16} strokeWidth={2} /> m.thorne@atlas.vc</span>
            </div>
            <p className="font-inter text-small text-text-body leading-relaxed mt-4 pt-4 border-t border-divider-line">
              Supporting the next generation of founders building generational companies. Focused on Fintech and Enterprise SaaS with a passion for student-led innovation and scalable infrastructure.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <h3 className="font-poppins font-semibold text-body text-text-heading pb-3 mb-4 border-b border-divider-line">Biography</h3>
            <p className="font-inter text-small text-text-body leading-relaxed mb-6">
              Marcus has spent over 15 years in the venture ecosystem, first as an operator at two hyper-growth unicorns and later as an early-stage investor. He believes that the most impactful companies are often built by those closest to the problem — which is why he focuses heavily on university ecosystems and student founders.
            </p>
            <h3 className="font-poppins font-semibold text-body text-text-heading pb-3 mb-4 border-b border-divider-line">Investment Philosophy</h3>
            <p className="font-inter text-small text-text-body leading-relaxed italic mb-6">
              "I invest in founders who display extreme technical competence paired with a deep sense of customer empathy. At Atlas, we aren't just looking for business models; we're looking for world-class builders who are obsessed with efficiency and structural change in their chosen industry."
            </p>
            <h3 className="font-poppins font-semibold text-body text-text-heading pb-3 mb-4 border-b border-divider-line">Areas of Interest</h3>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => <span key={i} className="px-3 py-1 bg-canvas-bg text-text-body font-inter text-small rounded-full">{i}</span>)}
            </div>
          </section>

          <section className="bg-surface-white border border-border-subtle rounded-lg p-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-divider-line">
              <h3 className="font-poppins font-semibold text-body text-text-heading">Recent Portfolio</h3>
              <ComingSoon label="View All Portfolio Companies" position="left" inline className="font-inter font-semibold text-small text-text-heading">
                View All
              </ComingSoon>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PORTFOLIO.map((p) => (
                <div key={p.name} className="border border-border-subtle rounded-lg p-4 hover:border-brand-black transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-canvas-bg flex items-center justify-center font-poppins font-bold text-small text-text-muted">{p.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-poppins font-semibold text-small text-text-heading">{p.name}</h4>
                      <p className="font-inter text-caption text-text-muted">{p.tag}</p>
                    </div>
                  </div>
                  <p className="font-inter text-caption text-text-body line-clamp-2">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface-white border border-border-subtle rounded-lg p-6 sticky top-24">
            <h3 className="font-poppins font-semibold text-body text-text-heading pb-3 mb-4 border-b border-divider-line">Investment Preferences</h3>
            <div className="space-y-4">
              <div>
                <p className="font-inter text-caption text-text-muted mb-1">Industries</p>
                <div className="flex flex-wrap gap-1">
                  {['Fintech', 'SaaS', 'DeepTech'].map((t) => <span key={t} className="px-2 py-0.5 border border-border-subtle rounded font-inter text-caption text-text-heading">{t}</span>)}
                </div>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted mb-1">Preferred Startup Stage</p>
                <p className="font-inter text-small text-text-heading">Seed, Series A</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted mb-1">Typical Investment Range</p>
                <p className="font-inter font-semibold text-small text-text-heading">$500K — $2.5M</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted mb-1">Geography</p>
                <p className="font-inter text-small text-text-heading">North America, Europe, SE Asia</p>
              </div>
              <div>
                <p className="font-inter text-caption text-text-muted mb-1">Portfolio Size</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-canvas-bg rounded-full overflow-hidden">
                    <div className="bg-brand-black h-full w-[65%]" />
                  </div>
                  <span className="font-inter text-small text-text-heading">42 Companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-white border border-border-subtle rounded-lg p-8 mt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-poppins font-semibold text-card text-text-heading">Ready to pitch Marcus?</h3>
            <p className="font-inter text-small text-text-muted mt-1">Submit your deck for review or wait for a direct invitation to connect.</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/investors/send-pitch" className="px-6 py-2.5 bg-action-bg text-action-text rounded-lg font-poppins font-semibold text-small hover:opacity-90 transition-all">
              Send Pitch Deck
            </Link>
            <ComingSoon label="Start Conversation" position="top" className="px-6 py-2.5 border border-border-subtle rounded-lg font-inter font-semibold text-small text-text-muted flex items-center gap-2">
              <MessageCircle size={18} strokeWidth={2} /> Start Conversation
            </ComingSoon>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-text-muted font-inter text-caption">
          <Info size={16} strokeWidth={2} /> Direct messaging is unlocked after Marcus reviews your pitch or initiates contact.
        </div>
      </div>
    </DashboardShell>
  );
}
