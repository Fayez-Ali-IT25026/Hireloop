import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Gift,
  GraduationCap,
  ListChecks,
  MapPin,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getJobById } from "@/lib/api/jobs";
import type { Job } from "@/types/job";
import ApplyPage from "../_components/ApplyPage";

export const instant = false;

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

const toList = (value: string) =>
  (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const Section = ({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
}) => {
  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
          <Icon className="size-4" />
        </span>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>

      <ul className="mt-4 space-y-2.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex gap-2.5 text-sm leading-relaxed text-zinc-400"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-indigo-400/70" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
};

const OverviewRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
      <Icon className="size-3.5" />
      {label}
    </span>
    <span className="text-right text-xs font-medium text-zinc-200">
      {value}
    </span>
  </div>
);

const JobDetailPage = async ({ params,}: {params: Promise<{ id: string }>;}) => {
  const { id } = await params;
  const job = await getJobById(id);

  // CHANGE: only one notFound() check now.
  // WHY: getJobById returns null for a missing job, and the old code checked
  // twice (plus had dead commented-out lines above it).
  if (!job) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute -top-48 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />

        <div className="relative mx-auto max-w-6xl px-4 pt-32 pb-10">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to jobs
          </Link>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                  <Briefcase className="size-6" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-[0.18em] text-indigo-400 uppercase">
                    {pretty(job.category)}
                  </p>
                  <h1 className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {job.title}
                  </h1>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-emerald-500/10 text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  {job.status === "active" ? "Actively hiring" : "Draft"}
                </Badge>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                  <MapPin className="size-3.5 text-zinc-500" />
                  {job.location || "Anywhere"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                  <Briefcase className="size-3.5 text-zinc-500" />
                  {job.type}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">
                  <Wallet className="size-3.5 text-zinc-500" />
                  {formatSalary(job)}
                </span>
              </div>
            </div>

            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                variant="outline"
                className="h-10 flex-1 gap-2 rounded-xl border-white/10 bg-transparent px-4 text-zinc-300 hover:bg-white/5 sm:flex-none"
              >
                <Bookmark className="size-4" />
                Save
              </Button>
              <Button className="h-10 flex-1 gap-2 rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 sm:flex-none">
                Apply now
                <Sparkles className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                <FileText className="size-4" />
              </span>
              <h2 className="text-sm font-semibold text-white">
                About the role
              </h2>
            </div>

            <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-zinc-400">
              {job.description || "No description provided yet."}
            </p>
          </section>

          <Section
            icon={ListChecks}
            title="Responsibilities"
            items={toList(job.responsibilities)}
          />
          <Section
            icon={GraduationCap}
            title="Requirements"
            items={toList(job.requirements)}
          />
          <Section icon={Gift} title="Benefits" items={toList(job.benefits)} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white">Job overview</h2>

            <div className="mt-2 divide-y divide-white/[0.06]">
              <OverviewRow
                icon={Wallet}
                label="Salary"
                value={formatSalary(job)}
              />
              <OverviewRow
                icon={Briefcase}
                label="Job type"
                value={job.type}
              />
              <OverviewRow
                icon={MapPin}
                label="Location"
                value={job.remote ? "Remote" : job.location || "Anywhere"}
              />
              <OverviewRow
                icon={CalendarDays}
                label="Deadline"
                value={formatDate(job.deadline)}
              />
              <OverviewRow
                icon={Clock}
                label="Posted"
                value={formatDate(job.createdAt)}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 via-indigo-500/10 to-transparent p-5">
            <Sparkles className="size-5 text-indigo-400" />
            <h2 className="mt-3 text-sm font-semibold text-white">
              Ready to apply?
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Applications close on {formatDate(job.deadline)}. Take a minute to
              tailor your resume before you send it.
            </p>
           <ApplyPage job={job}/>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default JobDetailPage;
