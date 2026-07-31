import Header from "@/components/landing/student/Header";
import Hero from "@/components/landing/student/Hero";
import ValueProps from "@/components/landing/student/ValueProps";
import StartupJourney from "@/components/landing/student/StartupJourney";
import Features from "@/components/landing/student/Features";
import Partners from "@/components/landing/student/Partners";
import SuccessStories from "@/components/landing/student/SuccessStories";
import FAQ from "@/components/landing/FAQ";
import BottomCTA from "@/components/landing/student/BottomCTA";
import Footer from "@/components/landing/student/Footer";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function LandingStudentPage() {
  useDocumentTitle("For Students — BOCC");

  return (
    <div className="min-h-screen bg-canvas-bg text-text-body">
      <Header />
      <main>
        <Hero />
        <ValueProps />
        <StartupJourney />
        <Features />
        <Partners />
        <SuccessStories />
        <FAQ />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
