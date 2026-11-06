import Image from "next/image";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

// ---------- Edit this content easily ----------
const trendingTags = [
  "React Developer",
  "Product Designer",
  "Data Analyst",
  "DevOps Engineer",
];

const stats = [
  { value: "10K+", label: "Open roles" },
  { value: "8K+", label: "Companies" },
  { value: "98%", label: "Hire success" },
];
// --------------------------------------------

const Hero = () => {
  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-950 px-4 pb-16 pt-32 text-center">
      {/* ---------- Background: globe + gradients ---------- */}
      <Image
        src="/globe.png"
        alt=""
        fill
        priority
        className="object-cover object-bottom"
      />
      {/* fades the top so content stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/70 to-zinc-950/10" />
      {/* indigo glow behind the headline */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(79,70,229,0.35),transparent_70%)]" />
      {/* fades the bottom into the page */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent" />

      {/* ---------- Content ---------- */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center">
        {/* badge */}
        <div className="inline-flex animate-in fade-in-0 slide-in-from-bottom-3 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-300 backdrop-blur">
          <span className="size-1.5 animate-pulse rounded-full bg-indigo-400" />
          <span className="font-medium text-white">88,000+</span> new jobs
          this week
        </div>

        {/* headline */}
        <h1 className="mt-6 animate-in fade-in-0 slide-in-from-bottom-4 bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-5xl font-semibold tracking-tight text-transparent delay-75 sm:text-7xl">
          Find Your Dream Job Today
        </h1>

        {/* subtitle */}
        <p className="mt-4 max-w-xl animate-in fade-in-0 slide-in-from-bottom-4 text-sm leading-relaxed text-zinc-400 delay-150 sm:text-base">
          Browse thousands of curated opportunities from world-class companies
          and land your next role — faster.
        </p>

        {/* search bar */}
        <form
          action="/jobs"
          className="mt-8 flex w-full max-w-2xl animate-in fade-in-0 slide-in-from-bottom-4 items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 pl-4 shadow-2xl shadow-indigo-950/60 delay-200 backdrop-blur-xl"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Search className="size-4 shrink-0 text-zinc-500" />
            <input
              name="q"
              placeholder="Job title, skill or company"
              className="w-full min-w-0 bg-transparent py-1.5 text-sm text-white placeholder:text-zinc-500 outline-none"
            />
          </div>

          <div className="hidden h-6 w-px bg-white/10 sm:block" />

          <div className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
            <MapPin className="size-4 shrink-0 text-zinc-500" />
            <input
              name="location"
              placeholder="Location or remote"
              className="w-full min-w-0 bg-transparent py-1.5 text-sm text-white placeholder:text-zinc-500 outline-none"
            />
          </div>

          <Button
            type="submit"
            size="icon"
            className="size-10 shrink-0 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 hover:bg-indigo-500"
            aria-label="Search jobs"
          >
            <Search className="size-4" />
          </Button>
        </form>

        {/* trending tags */}
        <div className="mt-5 flex animate-in fade-in-0 slide-in-from-bottom-4 flex-wrap items-center justify-center gap-2 delay-300">
          <span className="text-xs text-zinc-500">Trending:</span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-white"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* social proof line */}
        <p className="mt-24 text-2xl font-medium text-white delay-300 sm:text-3xl">
          Assisting over <span className="text-indigo-400">15,000</span> job
          seekers find their dream positions.
        </p>

        {/* stats */}
        <div className="mt-8 grid w-full max-w-2xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-black/40 py-5 backdrop-blur-xl delay-300">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-semibold text-white sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-zinc-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
