import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import LogoStrip from '@/components/landing/LogoStrip';
import Fostering from '@/components/landing/Fostering';
import Advantage from '@/components/landing/Advantage';
import Roles from '@/components/landing/Roles';
import Ecosystem from '@/components/landing/Ecosystem';
import Stories from '@/components/landing/Stories';
import Partner from '@/components/landing/Partner';
import FAQ from '@/components/landing/FAQ';
import CTA from '@/components/landing/CTA';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';
import FeaturedStartups from '@/components/landing/FeaturedStartups';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function LandingHomePage() {
  useDocumentTitle('BOCC — Business Orbit Campus Clubs');

  return (
    <div className="min-h-screen bg-canvas-bg text-text-body">
      <Navbar />
      <main>
        <Hero />
        <LogoStrip title="Backed by leading campus partners" />
        <Fostering />
        <Advantage />
        <Roles />
        <Ecosystem />
        <Stories />
        <FeaturedStartups />
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
