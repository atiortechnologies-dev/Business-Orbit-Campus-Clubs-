import Navbar from "../components/companies/Navbar";
import Hero from "../components/companies/Hero";
import ValueProposition from "../components/companies/ValueProposition";
import Process from "../components/companies/Process";
import TalentPipeline from "../components/companies/TalentPipeline";
import CoInnovation from "../components/companies/CoInnovation";
import FAQ from "../components/companies/FAQ";
import FinalCTA from "../components/companies/FinalCTA";
import Footer from "../components/companies/Footer";

export default function Companies() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <ValueProposition />
      <Process />
      <TalentPipeline />
      <CoInnovation />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}