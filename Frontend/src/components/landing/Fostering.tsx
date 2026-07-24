import { GraduationCap, Compass, Rocket } from "lucide-react";
import fosteringImage from "../../assets/fostering.jpg";

const items = [
  { icon: GraduationCap, title: "University Hub", desc: "Connect with top universities and student innovators across campuses worldwide." },
  { icon: Compass, title: "Campus Ecosystem", desc: "Access resources, mentors and programs tailored to student entrepreneurs." },
  { icon: Rocket, title: "Launch Support", desc: "Everything you need to go from campus idea to funded, growing startup." },
];

export default function Fostering() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 grid lg:grid-cols-2 gap-10 items-center">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-black/5">
          <img src={fosteringImage} alt="Students collaborating on campus" loading="lazy" width={1024} height={768} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">About Us</p>
          <h2 className="text-3xl lg:text-4xl font-black leading-tight">Fostering Innovation Across Campus Borders</h2>
          <p className="mt-4 text-neutral-600 leading-relaxed">
            At the core of what we do, BOCC is a mission-driven platform dedicated to nurturing startups from every corner of the campus world. We provide the tools, mentorship and network to help early-stage founders build, launch and scale.
          </p>
          <div className="mt-6 space-y-3">
            {items.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 bg-white border border-black/5 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{title}</div>
                  <p className="text-sm text-neutral-600 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}