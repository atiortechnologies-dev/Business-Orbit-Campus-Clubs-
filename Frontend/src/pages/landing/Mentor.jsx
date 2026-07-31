import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/mentor/Hero";
import WhyMentor from "@/components/landing/mentor/WhyMentor";
import Workflow from "@/components/landing/mentor/Workflow";
import Commitments from "@/components/landing/mentor/Commitments";
import ImpactStories from "@/components/landing/mentor/ImpactStories";
import FAQ from "@/components/landing/mentor/FAQ";
import CTA from "@/components/landing/mentor/CTA";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NAV_LINKS = [
  { label: "Why Mentor", href: "#why-mentor" },
  { label: "Workflow", href: "#workflow" },
  { label: "Commitments", href: "#commitments" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingMentorPage() {
  useDocumentTitle("For Mentors — BOCC");

  return (
    <div className="min-h-screen bg-canvas-bg text-text-body">
      <Navbar links={NAV_LINKS} />
      <main>
        <Hero />
        <WhyMentor />
        <Workflow />
        <Commitments />
        <ImpactStories />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
