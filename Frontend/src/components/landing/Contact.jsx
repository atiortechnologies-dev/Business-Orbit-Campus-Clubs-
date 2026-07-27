import { Mail, MapPin, Share2 } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';

export default function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <h2 className="font-poppins font-bold text-3xl lg:text-4xl text-text-heading">Get In Touch</h2>
        <p className="mt-3 font-inter text-body text-text-body max-w-xl">
          Have a question about the platform, a partnership idea, or need help
          getting started? Our team usually responds within 24 hours.
        </p>

        <div className="mt-8 space-y-4 max-w-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center shrink-0">
              <Mail size={16} strokeWidth={2} className="text-text-body" />
            </div>
            <div>
              <div className="font-inter text-caption text-text-muted">Email</div>
              <div className="font-poppins font-medium text-small text-text-heading">hello@bocc.co</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center shrink-0">
              <MapPin size={16} strokeWidth={2} className="text-text-body" />
            </div>
            <div>
              <div className="font-inter text-caption text-text-muted">Headquarters</div>
              <div className="font-poppins font-medium text-small text-text-heading">Innovation Hub, Global Campus Nexus</div>
            </div>
          </div>
        </div>

        {/* No real social accounts exist yet, and lucide-react has no brand
            logos to represent specific platforms honestly — a single
            generic "Follow us" stub says exactly as much as is true,
            rather than three icons implying specific (nonexistent)
            Twitter/LinkedIn/Instagram links. */}
        <div className="mt-8">
          <ComingSoon label="Follow us" position="top" inline className="inline-flex items-center gap-2 border border-border-subtle text-text-body px-4 py-2 rounded-full font-inter text-small">
            <Share2 size={14} strokeWidth={2} />
            Follow us
          </ComingSoon>
        </div>
      </div>
    </section>
  );
}
