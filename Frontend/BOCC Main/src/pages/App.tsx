import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import LogoStrip from "../components/landing/LogoStrip";
import Advantage from "../components/landing/Advantage";
import Fostering from "../components/landing/Fostering";
import Partner from "../components/landing/Partner";
import Ecosystem from "../components/landing/Ecosystem";
import Roadmap from "../components/landing/Roadmap";
import Stories from "../components/landing/Stories";
import FAQ from "../components/landing/FAQ";
import Contact from "../components/landing/Contact";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function App() {
  return (
    <>
      <Navbar />
<main>
  <Hero />
  <LogoStrip children={undefined} />
  <Fostering />
  <Advantage />
  <Roadmap />
  <Ecosystem />
  <Stories />
  <Partner />
  <FAQ />
  <CTA />
  <Contact />
</main>
<Footer />
    </>
  );
}