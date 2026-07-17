import { Check, Cpu } from "lucide-react";
// @ts-ignore: allow importing image without type declarations
import partnerImg from "../../assets/partner.jpg";

const features = [
  "Cloud & Backend Engineering",
  "AI/ML Infrastructure",
  "Web3 Enablement",
  "Product Design Studio",
];

export default function Partner() {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="bg-[#eeece5] rounded-3xl p-8 lg:p-14 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/70 rounded-full px-3 py-1 text-xs">
              <Cpu size={14} /> Atior Technologies
            </div>
            <h2 className="mt-4 text-3xl lg:text-4xl font-black">Our Official Technology Partner</h2>
            <p className="mt-4 text-neutral-700 leading-relaxed max-w-md">
              Atior Technologies powers the backend, infrastructure and developer experience behind BOCC — so founders can focus on shipping product, not fighting stack.
            </p>
            <div className="mt-6 grid sm:grid-cols-2 gap-2">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check size={16} /> {f}
                </div>
              ))}
            </div>
            <button className="mt-8 bg-black text-white text-sm px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors">
              Explore Axon Services
            </button>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-black/5">
            <img src={partnerImg} alt="Atior Technologies network" loading="lazy" width={1024} height={768} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}