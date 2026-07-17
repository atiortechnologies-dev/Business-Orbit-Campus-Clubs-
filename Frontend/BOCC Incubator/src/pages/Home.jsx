import Navbar from "@/components/bocc/Navbar";
import Hero from "@/components/bocc/Hero";
import ValueProps from "@/components/bocc/ValueProps";
import Lifecycle from "@/components/bocc/Lifecycle";
import InstitutionalValue from "@/components/bocc/InstitutionalValue";
import Stats from "@/components/bocc/Stats";
import SuccessStories from "@/components/bocc/SuccessStories";
import FAQ from "@/components/bocc/FAQ";
import FinalCTA from "@/components/bocc/FinalCTA";
import Footer from "@/components/bocc/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <Lifecycle />
        <InstitutionalValue />
        <Stats />
        <SuccessStories />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}