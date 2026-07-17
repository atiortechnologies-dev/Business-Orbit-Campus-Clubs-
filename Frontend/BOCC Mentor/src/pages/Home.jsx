import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/mentor-landing/Hero';
import WhyMentor from '@/components/mentor-landing/WhyMentor';
import Workflow from '@/components/mentor-landing/Workflow';
import Commitments from '@/components/mentor-landing/Commitments';
import ImpactStories from '@/components/mentor-landing/ImpactStories';
import FAQ from '@/components/mentor-landing/FAQ';
import CTA from '@/components/mentor-landing/CTA';

export default function Home() {
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