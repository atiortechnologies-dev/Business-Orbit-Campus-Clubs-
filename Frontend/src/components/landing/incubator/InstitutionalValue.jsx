import { Check, Download, Handshake } from "lucide-react";
import ComingSoon from "@/components/ui/ComingSoon";
import PlaceholderGraphic from "@/components/ui/PlaceholderGraphic";
import api from "@/api/axiosInstance";

const BENEFITS = [
  "Standardized startup evaluation framework",
  "Dedicated mentor network",
  "Global investor connections",
  "Startup performance analytics",
  "Co-branding opportunities",
  "Access to BOCC innovation ecosystem",
];

export default function InstitutionalValue() {
  const handleDownloadDeck = () => {
    api
      .get("/documents/partnership-deck")
      .then((res) => {
        if (res.data?.url) {
          window.open(res.data.url, "_blank", "noopener,noreferrer");
        }
      })
      .catch((err) => console.error("Failed to fetch partnership deck", err));
  };

  return (
    <section id="institutional" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative order-2 lg:order-1">
          <PlaceholderGraphic
            icon={Handshake}
            label="Partnership Overview"
            className="rounded-lg overflow-hidden shadow-card aspect-[4/3]"
          >
            <div className="absolute bottom-4 left-4 bg-surface-white/90 backdrop-blur rounded-md px-4 py-3 shadow-card border border-border-subtle">
              <div className="font-inter text-caption text-text-muted">
                Funding Readiness
              </div>
              <div className="font-poppins font-bold text-2xl text-text-heading">
                92<span className="text-accent-neon">%</span>
              </div>
            </div>
          </PlaceholderGraphic>
        </div>

        <div className="order-1 lg:order-2">
          <span className="font-inter text-caption font-semibold tracking-wider uppercase text-text-heading bg-accent-neon/15 px-3 py-1 rounded-full">
            Institutional Value
          </span>
          <h2 className="font-poppins font-bold text-3xl lg:text-4xl tracking-tight text-text-heading mt-4">
            Expand Your Incubator's Impact
          </h2>
          <p className="font-inter text-card text-text-body mt-4">
            Our partnership model is designed to enhance your existing
            capabilities while reducing administrative overhead.
          </p>

          <div className="mt-8 flex flex-col gap-3.5">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-accent-neon flex items-center justify-center">
                  <Check
                    size={14}
                    strokeWidth={3}
                    className="text-brand-black"
                  />
                </span>
                <span className="font-inter text-small font-medium text-text-body">
                  {b}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleDownloadDeck}
            className="inline-flex items-center gap-2 mt-8 font-inter text-small font-semibold text-text-heading border-b-2 border-accent-neon pb-1 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Download size={16} strokeWidth={2} />
            Download Partnership Brochure
          </button>
        </div>
      </div>
    </section>
  );
}
