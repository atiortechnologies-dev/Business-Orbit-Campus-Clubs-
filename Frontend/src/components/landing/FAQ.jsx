import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cmsApi } from "@/api/cmsApi";

const FALLBACK_FAQS = [
  { q: 'Who can join BOCC?', a: 'Any enrolled university student with an idea — or just the curiosity to explore startups. No prior experience required.' },
  { q: 'How long is the startup journey program?', a: 'The core 5-stage journey runs an average of 12 months, but you move at your own pace with mentor checkpoints along the way.' },
  { q: 'Do I need a co-founder to apply?', a: "No. Many founders join solo and find co-founders inside the community. We'll help you assess whether a team is right for your venture." },
  { q: 'Is the grant funding dilutive?', a: 'No. Our startup grants are non-dilutive — you keep full ownership of your company while you build.' },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const response = await cmsApi.getFaqs();
        if (Array.isArray(response) && response.length > 0) {
          setFaqs(response);
        } else if (response && Array.isArray(response.data) && response.data.length > 0) {
          setFaqs(response.data);
        } else if (response && Array.isArray(response.faqs) && response.faqs.length > 0) {
          setFaqs(response.faqs);
        }
      } catch (err) {
        console.error("Failed to load FAQs:", err);
      }
    }
    loadFaqs();
  }, []);

  return (
    <section id="faq" className="py-20 md:py-28 bg-surface-white">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <div className="text-center">
          <span className="font-inter text-caption font-semibold uppercase tracking-wider text-text-muted">FAQ</span>
          <h2 className="mt-3 font-poppins font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight text-text-heading">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-12 divide-y divide-border-subtle border-y border-border-subtle">
          {faqs.map((faq, idx) => {
            const isOpen = open === idx;
            return (
              <div key={faq._id || faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left"
                >
                  <span className="font-inter font-medium text-body md:text-card text-text-heading">{faq.question || faq.q}</span>
                  <ChevronDown
                    size={20}
                    strokeWidth={2}
                    className={`shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-text-heading' : ''}`}
                  />
                </button>
                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="pb-5 md:pb-6 font-inter text-small md:text-body text-text-muted leading-relaxed">{faq.answer || faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
