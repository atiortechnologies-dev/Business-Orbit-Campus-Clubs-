import { Navbar } from "./components/landing/Navbar";
import { Hero } from "./components/landing/Hero";
import { WhyInvest } from "./components/landing/WhyInvest";
import { InvestmentWorkflow } from "./components/landing/InvestmentWorkflow";
import { SuccessStories } from "./components/landing/SuccessStories";
import { Statistics } from "./components/landing/Statistics";
import { FAQ } from "./components/landing/FAQ";
import { CTA } from "./components/landing/CTA";
import { Footer } from "./components/landing/Footer";

export default function App() {
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