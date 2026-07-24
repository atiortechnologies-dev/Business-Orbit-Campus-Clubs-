import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';

const faqItems = [
  {
    question: 'What is the time commitment for mentors?',
    answer:
      'Mentors commit an average of 2-4 hours per month over a 12-month engagement cycle. Scheduling is flexible and coordinated through the Atior platform.',
  },
  {
    question: 'How are mentors matched with startups?',
    answer:
      'Our algorithm aligns mentor expertise with startup stage, industry, and specific needs. You can review and accept requests at your discretion.',
  },
  {
    question: 'Do I need prior mentorship experience?',
    answer:
      'No prior mentorship experience is required. We value real-world operational experience. Our onboarding includes a brief orientation to familiarize you with the workflow.',
  },
  {
    question: 'Is there compensation for mentoring?',
    answer:
      'Mentorship is voluntary. However, mentors gain equity-adjacent benefits through our advisor share program for exceptional engagements.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-20 lg:py-32 bg-white border-y border-[#EAEAEA]">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-black leading-[1.2]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#666666] leading-relaxed">
            Everything you need to know about the Atior mentorship program.
          </p>
        </FadeIn>
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-[#EAEAEA] bg-[#F8F8F8] rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-panel-${index}`}
              >
                <span className="text-base font-medium text-black pr-4">{item.question}</span>
                <span className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus size={20} className="text-[#C7D62F]" />
                  ) : (
                    <Plus size={20} className="text-black" />
                  )}
                </span>
              </button>
              <div
                id={`faq-panel-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-5 text-sm text-[#666666] leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}