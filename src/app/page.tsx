import Cta from "@/components/Cta";
import FeaturedJobs from "@/components/Featuredjobs";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Navbar/>
      <Hero />
      <FeaturedJobs/>
      <Features />
      <Pricing />
      <Cta/>
    </main>
  );
}
