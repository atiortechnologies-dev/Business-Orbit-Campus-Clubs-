import { Mail, Phone, MapPin } from "lucide-react";
import { FaLinkedin, FaInstagram, FaXTwitter, FaYoutube, FaTwitter } from "react-icons/fa6";
import { LogoLockup } from "./Logo";

const cols = [
  { title: "Ecosystem", links: ["Startup Journey", "Investors", "Mentors", "Partners", "Events"] },
  { title: "Resources", links: ["Startup Directory", "Success Stories", "FAQ", "Blog", "Community"] },
];

export function Footer() {
  return (
    <footer id="partners" className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <LogoLockup />
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Building India's largest campus innovation ecosystem by connecting students, mentors, investors, and industry leaders.
            </p>
            <div className="mt-5 flex gap-3">
              {[FaLinkedin, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-foreground hover:text-background">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-[13px] font-semibold text-foreground">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <div className="text-[13px] font-semibold text-foreground">Contact Us</div>
            <ul className="mt-4 space-y-3 text-[13px] text-muted-foreground">
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0" /> contact@bocc.orbit</li>
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0" /> +1 (555) 123-4567</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> Bengaluru, India</li>
            </ul>
            <div className="mt-5">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Technology Partner</div>
              <div className="mt-1 text-[13px] font-medium text-foreground">Atior Technologies</div>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
          <div className="text-[12px] text-muted-foreground">
            © 2026 BOCC – Business Orbit Campus Clubs. All Rights Reserved. Powered by Atior Technologies.
          </div>
          <div className="flex gap-5 text-[12px] text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}