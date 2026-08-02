import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/companies/Hero';
import ValueProposition from '@/components/landing/companies/ValueProposition';
import Process from '@/components/landing/companies/Process';
import TalentPipeline from '@/components/landing/companies/TalentPipeline';
import CoInnovation from '@/components/landing/companies/CoInnovation';
import FAQ from '@/components/landing/companies/FAQ';
import FinalCTA from '@/components/landing/companies/FinalCTA';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const NAV_LINKS = [
  { label: 'Why BOCC', href: '#partners' },
  { label: 'Process', href: '#roles' },
  { label: 'Talent', href: '#talent' },
  { label: 'FAQ', href: '#faq' },
];

export default function LandingCompaniesPage() {
  useDocumentTitle('For Companies — BOCC');

  return (
    <div className="min-h-screen bg-canvas-bg text-text-body">
      <Navbar links={NAV_LINKS} />
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
