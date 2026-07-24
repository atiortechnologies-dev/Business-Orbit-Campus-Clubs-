import { Navbar } from "../components/investor/Navbar";
import { Hero } from "../components/investor/Hero";
import { WhyInvest } from "../components/investor/WhyInvest";
import { InvestmentWorkflow } from "../components/investor/InvestmentWorkflow";
import { SuccessStories } from "../components/investor/SuccessStories";
import { Statistics } from "../components/investor/Statistics";
import { FAQ } from "../components/investor/FAQ";
import { CTA } from "../components/investor/CTA";
import { Footer } from "../components/investor/Footer";

export default function Investor() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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