import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import SectionHeading from './SectionHeading';

const FAQS = [
  { q: 'What is BOCC?', a: 'Business Orbit Campus Club (BOCC) is a unified ecosystem that connects companies with verified student talent, startups, mentors, and university research — bridging the gap between campus and industry.' },
  { q: 'Who can partner with BOCC?', a: 'Companies of all sizes, from early-stage startups to large enterprises, can partner with BOCC to access talent, sponsor research, or collaborate on innovation projects.' },
  { q: 'How does recruitment work?', a: 'Post an opportunity, review verified applicant profiles matched to your requirements, then hire and onboard talent or launch collaborative projects — all managed through a single dashboard.' },
  { q: 'Do startups qualify for partnerships?', a: 'Yes. Verified startups can both contribute talent and collaborate on co-innovation projects, sponsored research, and product validation initiatives.' },
  { q: 'How do colleges join?', a: 'Colleges and universities can join the BOCC network to connect their students and research labs with industry partners. Reach out to our partnership team to begin the onboarding process.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-surface-white py-20 lg:py-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about partnering with Business Orbit Campus Club."
        />

        <div className="mt-12 divide-y divide-border-subtle border-y border-border-subtle">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-inter text-body sm:text-card font-medium text-text-heading">{faq.q}</span>
                  <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-border-subtle text-text-body">
                    {isOpen ? <Minus size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <p className="overflow-hidden font-inter text-[15px] leading-relaxed text-text-muted">{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
