import { useState } from 'react';
import { Plus, Minus } from "lucide-react";
import SectionHeading from './SectionHeading';
import FadeIn from './FadeIn';

const FAQS = [
  {
    q: 'What is BOCC?',
    a: 'Business Orbit Campus Club (BOCC) is a unified ecosystem that connects companies with verified student talent, startups, mentors, and university research — bridging the gap between campus and industry.',
  },
  {
    q: 'Who can partner with BOCC?',
    a: 'Companies of all sizes, from early-stage startups to large enterprises, can partner with BOCC to access talent, sponsor research, or collaborate on innovation projects.',
  },
  {
    q: 'How does recruitment work?',
    a: 'Post an opportunity, review verified applicant profiles matched to your requirements, then hire and onboard talent or launch collaborative projects — all managed through a single dashboard.',
  },
  {
    q: 'Do startups qualify for partnerships?',
    a: 'Yes. Verified startups can both contribute talent and collaborate on co-innovation projects, sponsored research, and product validation initiatives.',
  },
  {
    q: 'How do colleges join?',
    a: 'Colleges and universities can join the BOCC network to connect their students and research labs with industry partners. Reach out to our partnership team to begin the onboarding process.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-white py-20 lg:py-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about partnering with Business Orbit Campus Club."
        />

        <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={faq.q} delay={i * 0.05}>
                <div>
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left lime-focus rounded-lg"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-medium text-neutral-900 sm:text-lg">{faq.q}</span>
                    <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border border-neutral-200 text-neutral-700">
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <p className="overflow-hidden text-[15px] leading-relaxed text-neutral-500">{faq.a}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}