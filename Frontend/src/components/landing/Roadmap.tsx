import { User, GraduationCap, Grid3x3, Users, Briefcase } from "lucide-react";

const roles = [
  { icon: User, title: "Student", desc: "Launch your idea with mentors, tools and community.", cta: "Apply as Student" },
  { icon: GraduationCap, title: "Mentor", desc: "Guide the next generation of student founders.", cta: "Apply as Mentor" },
  { icon: Grid3x3, title: "Investor", desc: "Discover high-potential campus startups early.", cta: "Register Interest" },
  { icon: Users, title: "Incubator", desc: "Offer resources, perks or programs to the ecosystem.", cta: "Partner with Us" },
  { icon: Briefcase, title: "Organisation", desc: "Join events, workshops and founder circles.", cta: "Join Organisation" },
];

export default function Roles() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <h2 className="text-3xl lg:text-4xl font-black text-center">Choose Your Role</h2>
        <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {roles.map(({ icon: Icon, title, desc, cta }) => (
            <div key={title} className="bg-[#f5f4f0] rounded-2xl p-6 text-center flex flex-col items-center border border-black/5">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm text-neutral-600 flex-1">{desc}</p>
              <button className="mt-5 text-xs border border-black/15 px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors">
                {cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}