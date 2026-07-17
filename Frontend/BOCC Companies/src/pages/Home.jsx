import Navbar from '@/components/bocc/Navbar';
import Hero from '@/components/bocc/Hero';
import ValueProposition from '@/components/bocc/ValueProposition';
import Process from '@/components/bocc/Process';
import TalentPipeline from '@/components/bocc/TalentPipeline';
import CoInnovation from '@/components/bocc/CoInnovation';
import FAQ from '@/components/bocc/FAQ';
import FinalCTA from '@/components/bocc/FinalCTA';
import Footer from '@/components/bocc/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ValueProposition />
        <Process />
        <TalentPipeline />
        <CoInnovation />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}