import { Suspense } from "react";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  MapPin,
  SearchX,
  Wallet,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { getJobs } from "@/lib/actions/jobs";
import type { Job } from "@/types/job";

import JobFilters from "./JobFilters";

const formatSalary = (job: Job) => {
  if (job.salaryMin == null && job.salaryMax == null) {
    return "Salary not specified";
  }

  const number = (value: number) => new Intl.NumberFormat("en-US").format(value);

  if (job.salaryMin != null && job.salaryMax != null) {
    return `${job.currency} ${number(job.salaryMin)} – ${number(job.salaryMax)}`;
  }

  return `${job.currency} ${number(job.salaryMin ?? job.salaryMax ?? 0)}`;
};

const formatDate = (value: string) => {
  if (!value) return "Open until filled";

  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return "Open until filled";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const pretty = (value: string) => {
  const text = (value || "").replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const JobCard = ({ job }: { job: Job }) => (
  <article className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-white/[0.05]">
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
          <Briefcase className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-white">
            {job.title}
          </h2>
          <p className="text-xs text-zinc-500">{pretty(job.category)}</p>
        </div>
      </div>

      {job.isRemote ? (
        <Badge className="shrink-0 border-0 bg-emerald-500/10 text-emerald-300">
          Remote
        </Badge>
      ) : null}
    </div>

    <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-zinc-500">
      {job.description || "No description provided yet."}
    </p>

    <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-zinc-300">
      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
        <MapPin className="size-3 text-zinc-500" />
        {job.location || "Anywhere"}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
        <Briefcase className="size-3 text-zinc-500" />
        {job.jobType}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1">
        <Wallet className="size-3 text-zinc-500" />
        {formatSalary(job)}
      </span>
    </div>

    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
      <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
        <CalendarDays className="size-3.5" />
        Apply by {formatDate(job.deadline)}
      </span>

      <button
        type="button"
        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 transition-all group-hover:gap-2"
      >
        View role
        <ArrowUpRight className="size-3.5" />
      </button>
    </div>
  </article>
);

const JobsList = async ({
  searchParams,
}: {
  searchParams: PageProps<"/jobs">["searchParams"];
}) => {
  const search = await searchParams;
  const query = new URLSearchParams(search as Record<string, string>).toString();

  const jobs: Job[] = await getJobs(query);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">
          <span className="font-semibold text-white">{jobs.length}</span>{" "}
          {jobs.length === 1 ? "role" : "roles"} available
        </p>
        <span className="flex items-center gap-1.5 text-xs text-zinc-600">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Updated live
        </span>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-20 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-white/[0.04] text-zinc-500 ring-1 ring-white/[0.06]">
            <SearchX className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-white">
            No jobs found
          </h2>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Try a different search, or clear your filters to see every open
            role.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </>
  );
};

const JobsSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="flex items-center gap-3">
          <div className="size-11 animate-pulse rounded-xl bg-white/[0.06]" />
          <div className="space-y-2">
            <div className="h-3.5 w-36 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-3 w-20 animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.04]" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-24 animate-pulse rounded-full bg-white/[0.05]" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.05]" />
        </div>
      </div>
    ))}
  </div>
);















const jobsPage = async ({ searchParams }: PageProps<"/jobs">) => {


     const search = await searchParams
    const urlSearch = new URLSearchParams(search as Record<string, string>)
    const query = urlSearch.toString()

    console.log("Search params:", query)
    // TODO: implement the query-param wiring from the filter UI here.
    const jobs = await getJobs(query)










    




  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-48 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-4 pt-32 pb-6">
          <p className="text-xs font-medium tracking-[0.2em] text-indigo-400 uppercase">
            Job board
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Find your next <span className="text-indigo-400">role</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Browse live openings from teams hiring right now. Search by title,
            then narrow things down by category or job type.
          </p>

          <div className="mt-8">
            <JobFilters />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-4 pb-24">
        <Suspense
          fallback={
            <>
              <div className="h-5 w-40 animate-pulse rounded bg-white/[0.05]" />
              <div className="mt-5">
                <JobsSkeleton />
              </div>
            </>
          }
        >
          <JobsList searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
};

export default jobsPage;
