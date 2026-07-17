import { Globe, BookOpen, Award, Package } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { icon: Globe, title: "Global Network", desc: "Connect with founders, mentors and investors across a global entrepreneurial network." },
  { icon: BookOpen, title: "Curated Content", desc: "Handpicked resources, playbooks and case studies to accelerate your journey." },
  { icon: Award, title: "Expert Mentorship", desc: "Learn directly from seasoned founders and industry-leading operators." },
  { icon: Package, title: "Resource Access", desc: "Perks, tools and infrastructure to help you build and ship faster." },
];

export default function Advantage() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-black">The BOCC Advantage</h2>
          <p className="mt-3 text-neutral-600">A curated stack of tools, mentorship and community — designed to give your startup an unfair advantage.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-[#f5f4f0] rounded-2xl p-6 border border-black/5 transition-shadow hover:shadow-lg hover:border-black/10"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-6 transition-colors group-hover:bg-black">
                <Icon size={18} />
              </div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}