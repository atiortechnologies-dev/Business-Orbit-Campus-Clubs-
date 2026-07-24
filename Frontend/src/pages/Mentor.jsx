import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

import Hero from "../components/mentor/Hero";
import WhyMentor from "../components/mentor/WhyMentor";
import Workflow from "../components/mentor/Workflow";
import Commitments from "../components/mentor/Commitments";
import ImpactStories from "../components/mentor/ImpactStories";
import FAQ from "../components/mentor/FAQ";
import CTA from "../components/mentor/CTA";

export default function Mentor() {
  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <Navbar />

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