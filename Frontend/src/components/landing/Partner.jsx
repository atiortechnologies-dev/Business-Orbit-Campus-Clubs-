import { Check, Cpu } from 'lucide-react';

const FEATURES = [
  'Cloud & Backend Engineering',
  'AI/ML Infrastructure',
  'Web3 Enablement',
  'Product Design Studio',
];

export default function Partner() {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="bg-canvas-bg rounded-lg p-8 lg:p-14 grid lg:grid-cols-2 gap-10 items-center border border-border-subtle">
          <div>
            <div className="inline-flex items-center gap-2 bg-surface-white border border-border-subtle rounded-full px-3 py-1 font-inter text-caption text-text-body">
              <Cpu size={14} strokeWidth={2} /> Atior Technologies
            </div>
            <h2 className="mt-4 font-poppins font-bold text-3xl lg:text-4xl text-text-heading">Our Official Technology Partner</h2>
            <p className="mt-4 font-inter text-body text-text-body leading-relaxed max-w-md">
              Atior Technologies powers the backend, infrastructure and developer experience behind BOCC — so founders can focus on shipping product, not fighting stack.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-2">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2 font-inter text-small text-text-body">
                  <Check size={16} strokeWidth={2} className="text-text-muted" /> {f}
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] placeholder-box rounded-lg" />
        </div>
      </div>
    </section>
  );
}
