import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/incubator/Hero";
import ValueProps from "@/components/landing/incubator/ValueProps";
import Lifecycle from "@/components/landing/incubator/Lifecycle";
import InstitutionalValue from "@/components/landing/incubator/InstitutionalValue";
import Stats from "@/components/landing/incubator/Stats";
import SuccessStories from "@/components/landing/incubator/SuccessStories";
import FAQ from "@/components/landing/incubator/FAQ";
import FinalCTA from "@/components/landing/incubator/FinalCTA";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NAV_LINKS = [
  { label: "Why BOCC", href: "#value" },
  { label: "Framework", href: "#lifecycle" },
  { label: "Benefits", href: "#institutional" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingIncubatorPage() {
  useDocumentTitle("For Incubators — BOCC");

  return (
    <div className="min-h-screen bg-canvas-bg text-text-body">
      <Navbar links={NAV_LINKS} />
      <Hero />
      <ValueProps />
      <Lifecycle />
      <InstitutionalValue />
      <Stats />
      <SuccessStories />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
