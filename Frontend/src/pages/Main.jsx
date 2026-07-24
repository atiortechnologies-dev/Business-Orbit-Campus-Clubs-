import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import LogoStrip from "../components/landing/LogoStrip";
import Fostering from "../components/landing/Fostering";
import Advantage from "../components/landing/Advantage";
import Roadmap from "../components/landing/Roadmap";
import Ecosystem from "../components/landing/Ecosystem";
import Stories from "../components/landing/Stories";
import Partner from "../components/landing/Partner";
import FAQ from "../components/landing/FAQ";
import CTA from "../components/landing/CTA";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";


export default function Main() {
  return (
    <div className="min-h-screen bg-[#f5f4f0] text-neutral-900 font-sans">
      <Navbar />
      <main>
        <Hero />
        <LogoStrip title="Backed by leading campus partners" />
        <Fostering />
        <Advantage />
        <Roadmap />
        <Ecosystem />
        <Stories />
        <Partner />
        <LogoStrip title="Featured in leading publications" />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}