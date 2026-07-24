import Navbar from "../components/incubator/Navbar";
import Hero from "../components/incubator/Hero";
import ValueProps from "../components/incubator/ValueProps";
import Lifecycle from "../components/incubator/Lifecycle";
import InstitutionalValue from "../components/incubator/InstitutionalValue";
import Stats from "../components/incubator/Stats";
import SuccessStories from "../components/incubator/SuccessStories";
import FAQ from "../components/incubator/FAQ";
import FinalCTA from "../components/incubator/FinalCTA";
import Footer from "../components/incubator/Footer";

export default function Incubator() {
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