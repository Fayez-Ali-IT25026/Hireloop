import FeaturedJobs from "@/components/Featuredjobs";
import Features from "@/components/Features";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Hero />
      <FeaturedJobs/>
      <Features />
    </main>
  );
}
