import { Globe, BookOpen, Award, Package } from 'lucide-react';

const ITEMS = [
  { icon: Globe, title: 'Global Network', desc: 'Connect with founders, mentors and investors across a global entrepreneurial network.' },
  { icon: BookOpen, title: 'Curated Content', desc: 'Handpicked resources, playbooks and case studies to accelerate your journey.' },
  { icon: Award, title: 'Expert Mentorship', desc: 'Learn directly from seasoned founders and industry-leading operators.' },
  { icon: Package, title: 'Resource Access', desc: 'Perks, tools and infrastructure to help you build and ship faster.' },
];

export default function Advantage() {
  return (
    <section className="py-20 lg:py-28 bg-surface-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-text-heading">The BOCC Advantage</h2>
          <p className="mt-3 font-inter text-body text-text-body">A curated stack of tools, mentorship and community — designed to give your startup an unfair advantage.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-canvas-bg rounded-lg p-6 border border-border-subtle transition-all hover:shadow-card hover:border-text-muted hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-full bg-surface-white flex items-center justify-center mb-6">
                <Icon size={18} strokeWidth={2} className="text-text-body" />
              </div>
              <h3 className="font-poppins font-bold text-body text-text-heading">{title}</h3>
              <p className="mt-2 font-inter text-small text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
