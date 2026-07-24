import { Mail, MapPin } from "lucide-react";
import { FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Contact() {
  const socials = [FaTwitter, FaLinkedin, FaInstagram];

  return (
    <section className="py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <h2 className="text-3xl lg:text-4xl font-black">
          Get In Touch
        </h2>

        <p className="mt-3 text-neutral-600 max-w-xl">
          Have a question about the platform, a partnership idea, or need help
          getting started? Our team usually responds within 24 hours.
        </p>

        <div className="mt-8 space-y-4 max-w-md">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center shrink-0">
              <Mail size={16} />
            </div>

            <div>
              <div className="text-xs text-neutral-500">Email</div>
              <div className="font-medium text-sm">
                hello@bocc.co
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center shrink-0">
              <MapPin size={16} />
            </div>

            <div>
              <div className="text-xs text-neutral-500">
                Headquarters
              </div>
              <div className="font-medium text-sm">
                Innovation Hub, Global Campus Nexus
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          {socials.map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}