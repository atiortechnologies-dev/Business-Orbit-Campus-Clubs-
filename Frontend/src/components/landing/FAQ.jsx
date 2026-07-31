import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cmsApi } from '@/api/cmsApi';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [open, setOpen] = useState(0);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const response = await cmsApi.getFaqs();
        // Assuming response is an array of FAQs or response.data is the array
        if (Array.isArray(response)) {
          setFaqs(response);
        } else if (response && Array.isArray(response.data)) {
          setFaqs(response.data);
        } else if (response && Array.isArray(response.faqs)) {
          setFaqs(response.faqs);
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err);
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
              <div key={faq._id || idx}>
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
