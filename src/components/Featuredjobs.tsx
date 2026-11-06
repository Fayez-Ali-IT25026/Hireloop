import Image from "next/image";
import { ArrowUpRight, Bookmark } from "lucide-react";

const jobs = [
  { company: "Google", logo: "/google.png", title: "Frontend Developer", location: "New York, USA", type: "Hybrid", salary: "$70-80K" },
  { company: "Meta", logo: "/meta.png", title: "React Engineer", location: "London, UK", type: "Remote", salary: "$80-95K" },
  { company: "Airbnb", logo: "/airbnb.png", title: "UI Engineer", location: "San Francisco, USA", type: "On-site", salary: "$90-110K" },
  { company: "Spotify", logo: "/spotify.png", title: "Full Stack Developer", location: "Stockholm, SE", type: "Hybrid", salary: "$75-90K" },
  { company: "Netflix", logo: "/netflix.png", title: "Product Designer", location: "Los Gatos, USA", type: "Remote", salary: "$95-120K" },
  { company: "Microsoft", logo: "/microsoft.png", title: "Next.js Developer", location: "Seattle, USA", type: "Hybrid", salary: "$85-100K" },
];

const FeaturedJobs = () => {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">Smart Job Discovery</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          The roles you&apos;d never <br /> find by searching
        </h2>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <article
            key={job.company}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Image src={job.logo} alt={job.company} width={36} height={36} className="rounded-lg bg-white/10 p-1.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white">{job.title}</h3>
                  <p className="text-xs text-zinc-500">{job.company}</p>
                </div>
              </div>
              <Bookmark className="size-4 text-zinc-600 transition group-hover:text-indigo-400" />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-zinc-500">
              Showcase your skills and join a team building products used by millions of people.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-zinc-300">
              {[job.location, job.type, job.salary].map((t) => (
                <span key={t} className="rounded-full bg-white/5 px-2.5 py-1">{t}</span>
              ))}
            </div>

            <button className="mt-5 flex items-center gap-1 text-xs font-medium text-indigo-400 transition group-hover:gap-2">
              Apply Now <ArrowUpRight className="size-3.5" />
            </button>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200">
          View all jobs
        </button>
      </div>
    </section>
  );
};

export default FeaturedJobs;