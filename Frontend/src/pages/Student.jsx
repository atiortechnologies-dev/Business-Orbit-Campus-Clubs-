import Header from "@/components/student/Header";
import Hero from "@/components/student/Hero";
import ValueProps from "@/components/student/ValueProps";
import StartupJourney from "@/components/student/StartupJourney";
import Features from "@/components/student/Features";
import Partners from "@/components/student/Partners";
import SuccessStories from "@/components/student/SuccessStories";
import FAQ from "@/components/student/FAQ";
import BottomCTA from "@/components/student/BottomCTA";
import Footer from "@/components/student/Footer";

export default function Student() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
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