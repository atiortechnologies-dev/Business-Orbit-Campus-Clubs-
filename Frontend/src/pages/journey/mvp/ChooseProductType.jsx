import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Laptop2, Package, Check, ChevronRight, ArrowRight } from 'lucide-react';
import DashboardShell from '@/components/dashboard/DashboardShell';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { setProductType } from '@/api/startup/mvpApi';

const OPTIONS = [
  {
    key: 'digital',
    icon: Laptop2,
    title: 'Digital Product',
    desc: 'A web app, mobile app, or SaaS platform — validated with a live, clickable build.',
    points: ['Ship faster, iterate in days', 'Real usage data from day one', 'Lower upfront cost'],
  },
  {
    key: 'physical',
    icon: Package,
    title: 'Physical Product',
    desc: 'A tangible good — validated with a prototype, sample run, or pre-order campaign.',
    points: ['Tactile feedback from real users', 'Manufacturing/supply-chain learnings', 'Longer iteration cycles'],
  },
];

export default function ChooseProductTypePage() {
  useDocumentTitle('Choose Your Product Type — BOCC');
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    try {
      setIsSubmitting(true);
      await setProductType({ type: selected });
      navigate('/build-startup/journey/mvp/submit');
    } catch (err) {
      console.error(err);
      alert("Failed to save product type. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell pageId="choose-product-type">
      <nav className="mb-2 flex items-center gap-2 text-text-muted font-inter font-normal text-small">
        <Link to="/dashboard" className="hover:text-text-heading transition-colors">Dashboard</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <Link to="/build-startup/journey/mvp" className="hover:text-text-heading transition-colors">MVP</Link>
        <ChevronRight size={14} strokeWidth={2} />
        <span className="text-text-heading font-semibold">Choose Product Type</span>
      </nav>

      <h1 className="font-poppins font-semibold text-page text-text-heading mb-1">Choose Your Product Type</h1>
      <p className="font-inter text-body text-text-body mb-8 max-w-2xl">
        This tailors the guidance and templates you'll see through the rest of the MVP stage.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {OPTIONS.map(({ key, icon: Icon, title, desc, points }) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`text-left p-6 rounded-lg border-2 transition-colors ${
                isSelected ? 'border-brand-black bg-surface-white shadow-card' : 'border-border-subtle bg-surface-white hover:border-text-muted'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-canvas-bg border border-border-subtle flex items-center justify-center">
                  <Icon size={22} strokeWidth={2} className="text-text-body" />
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-brand-black flex items-center justify-center">
                    <Check size={14} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </div>
              <h3 className="font-poppins font-semibold text-card text-text-heading mb-1">{title}</h3>
              <p className="font-inter text-small text-text-muted mb-4">{desc}</p>
              <ul className="space-y-1.5">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2 font-inter text-small text-text-body">
                    <Check size={14} strokeWidth={2} className="text-success shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!selected || isSubmitting}
        onClick={handleContinue}
        className="inline-flex items-center gap-2 bg-action-bg text-action-text px-8 py-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all font-poppins font-semibold text-body disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:opacity-40"
      >
        {isSubmitting ? "Saving..." : "Continue"}
        {!isSubmitting && <ArrowRight size={18} strokeWidth={2} />}
      </button>
    </DashboardShell>
  );
}
