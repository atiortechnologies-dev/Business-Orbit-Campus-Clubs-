import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import ValueProps from "@/components/landing/ValueProps";
import StartupJourney from "@/components/landing/StartupJourney";
import Features from "@/components/landing/Features";
import Partners from "@/components/landing/Partners";
import SuccessStories from "@/components/landing/SuccessStories";
import FAQ from "@/components/landing/FAQ";
import BottomCTA from "@/components/landing/BottomCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
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