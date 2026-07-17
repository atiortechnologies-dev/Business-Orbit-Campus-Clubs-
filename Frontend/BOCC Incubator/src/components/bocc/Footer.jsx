import { Linkedin, Twitter, Instagram, Mail, Phone, Globe } from "lucide-react";
import boccLogo from "@/assets/bocc-logo.png";

const cols = [
  {
    title: "Programs",
    links: ["Startup Journey", "Incubation", "Mentorship", "Campus Clubs"],
  },
  {
    title: "Resources",
    links: ["Case Studies", "Success Stories", "FAQ", "Events"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#FAFAFA] border-t border-[#EAEAEA]">
      {/* live feed marquee */}
      <div className="bg-[#111111] py-2.5 overflow-hidden">
        <div className="flex gap-8 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex gap-8">
              {[
                "🚀 University X startup secured Seed funding",
                "📈 12 new mentors joined the network",
                "🎓 8 startups graduated from the framework",
                "🤝 New partnership signed with Tech Campus",
                "💡 BOCC Demo Day scheduled for Q3 2026",
              ].map((t, i) => (
                <span key={i} className="text-xs text-[#C6D82D] font-medium">
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src={boccLogo}
                alt="BOCC Logo"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-[#666] leading-relaxed max-w-sm">
              Empowering universities and incubators to build thriving startup
              ecosystems — by Atior Technologies.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white border border-[#EAEAEA] flex items-center justify-center text-[#111111] hover:bg-[#C6D82D] hover:border-[#C6D82D] transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading font-semibold text-sm text-[#111111] mb-4">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-[#666] hover:text-[#111111] transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-[#111111] mb-4">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="mailto:partnerships@bocc.tech" className="flex items-center gap-2 text-sm text-[#666] hover:text-[#111111] transition-colors">
                  <Mail className="w-4 h-4" />
                  partnerships@bocc.tech
                </a>
              </li>
              <li>
                <a href="tel:+10000000000" className="flex items-center gap-2 text-sm text-[#666] hover:text-[#111111] transition-colors">
                  <Phone className="w-4 h-4" />
                  +1 (000) 000-0000
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#666]">
                <Globe className="w-4 h-4" />
                Technology Partner: Atior Technologies
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#888]">
            © 2026 Atior Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#888] hover:text-[#111111] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-[#888] hover:text-[#111111] transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}