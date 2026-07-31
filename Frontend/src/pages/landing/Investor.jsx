import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/investor/Hero";
import WhyInvest from "@/components/landing/investor/WhyInvest";
import InvestmentWorkflow from "@/components/landing/investor/InvestmentWorkflow";
import SuccessStories from "@/components/landing/investor/SuccessStories";
import Statistics from "@/components/landing/investor/Statistics";
import FAQ from "@/components/landing/investor/FAQ";
import CTA from "@/components/landing/investor/CTA";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NAV_LINKS = [
  { label: "Why Invest", href: "#investors" },
  { label: "Workflow", href: "#journey" },
  { label: "Stories", href: "#stories" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingInvestorPage() {
  useDocumentTitle("For Investors — BOCC");

  return (
    <div className="min-h-screen bg-canvas-bg text-text-body">
      <Navbar links={NAV_LINKS} />
      <main>
        <Hero />
        <WhyInvest />
        <InvestmentWorkflow />
        <SuccessStories />
        <Statistics />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
