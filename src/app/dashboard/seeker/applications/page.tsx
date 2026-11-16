"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  Clock,
  FileText,
  MapPin,
  RefreshCw,
  SearchX,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { getApplications } from "@/lib/actions/applications";
import { cn } from "@/lib/utils";
import type { ApplicationStatus, JobApplication } from "@/types/application";

const statusMeta: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  applied: { label: "Applied", className: "bg-indigo-500/10 text-indigo-300" },
  reviewing: { label: "In review", className: "bg-amber-500/10 text-amber-300" },
  shortlisted: { label: "Shortlisted", className: "bg-sky-500/10 text-sky-300" },
  interview: { label: "Interview", className: "bg-violet-500/10 text-violet-300" },
  offer: { label: "Offer", className: "bg-emerald-500/10 text-emerald-300" },
  hired: { label: "Hired", className: "bg-emerald-500/10 text-emerald-300" },
  rejected: { label: "Not selected", className: "bg-red-500/10 text-red-300" },
  withdrawn: { label: "Withdrawn", className: "bg-white/5 text-zinc-400" },
};

const statusOrder = Object.keys(statusMeta) as ApplicationStatus[];

const pretty = (value?: string) => {
  if (!value) return "";
  const text = value.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const formatDate = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatSalary = (application: JobApplication) => {
  if (application.salaryMin == null && application.salaryMax == null) {
    return null;
  }

  const amount = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const currency = application.currency ?? "";

  if (application.salaryMin != null && application.salaryMax != null) {
    return `${currency} ${amount(application.salaryMin)} – ${amount(
      application.salaryMax
    )}`.trim();
  }

  return `${currency} ${amount(
    application.salaryMin ?? application.salaryMax ?? 0
  )}`.trim();
};

const Chip = ({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-400">
    <Icon className="size-3 text-zinc-500" />
    {children}
  </span>
);

const ApplicationCard = ({ application }: { application: JobApplication }) => {
  const status = statusMeta[application.status] ?? {
    label: pretty(application.status),
    className: "bg-white/5 text-zinc-300",
  };
  const salary = formatSalary(application);

  return (
    <article className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-indigo-500/30 hover:bg-white/[0.04] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
            <Briefcase className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white">
              {application.jobTitle}
            </h2>
            <p className="truncate text-xs text-zinc-500">
              {pretty(application.category) || "Role"}
              {application.jobType ? ` · ${application.jobType}` : ""}
            </p>
          </div>
        </div>

        <Badge className={cn("border-0", status.className)}>
          {status.label}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {application.location ? (
          <Chip icon={MapPin}>{application.location}</Chip>
        ) : null}
        {application.isRemote ? <Chip icon={MapPin}>Remote</Chip> : null}
        {salary ? <Chip icon={Wallet}>{salary}</Chip> : null}
        {application.deadline ? (
          <Chip icon={CalendarDays}>
            Closes {formatDate(application.deadline)}
          </Chip>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
          <Clock className="size-3.5" />
          Applied {formatDate(application.appliedAt)}
        </span>

        <Link
          href={`/jobs/${application.jobId}`}
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 transition-all hover:gap-1.5 hover:text-indigo-300"
        >
          View job
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
};

const CardSkeleton = () => (
  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
    <div className="flex items-center gap-3">
      <div className="size-11 animate-pulse rounded-xl bg-white/[0.06]" />
      <div className="space-y-2">
        <div className="h-3.5 w-40 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-3 w-24 animate-pulse rounded bg-white/[0.04]" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-6 w-28 animate-pulse rounded-full bg-white/[0.05]" />
      <div className="h-6 w-20 animate-pulse rounded-full bg-white/[0.05]" />
    </div>
  </div>
);

const SeekerApplicationsPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadApplications = useCallback(async () => {
    if (!userId) return;

    try {
      const data = await getApplications(`applicantId=${userId}`);
      setApplications(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError(
        "Could not load your applications. Make sure the API server is running."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Wait for the session, then load this seeker's applications.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadApplications();
  }, [loadApplications]);

  const refresh = () => {
    setError("");
    setLoading(true);
    void loadApplications();
  };

  const counts = useMemo(() => {
    const result: Record<string, number> = { all: applications.length };

    for (const application of applications) {
      result[application.status] = (result[application.status] ?? 0) + 1;
    }

    return result;
  }, [applications]);

  const stats = [
    { label: "Total", value: applications.length, icon: FileText },
    {
      label: "In review",
      value: (counts.reviewing ?? 0) + (counts.shortlisted ?? 0),
      icon: Clock,
    },
    { label: "Interviews", value: counts.interview ?? 0, icon: Users },
    {
      label: "Offers",
      value: (counts.offer ?? 0) + (counts.hired ?? 0),
      icon: Trophy,
    },
  ];

  const visible =
    filter === "all"
      ? applications
      : applications.filter((application) => application.status === filter);

  if (!isPending && !userId) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/[0.06] bg-white/[0.02] px-6 py-24 text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
          <FileText className="size-6" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-white">
          Sign in to track applications
        </h2>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          Your applications are tied to your HireLoop account.
        </p>
        <Link
          href="/signin"
          className={cn(
            buttonVariants(),
            "mt-5 h-10 rounded-xl bg-indigo-600 px-5 text-white hover:bg-indigo-500"
          )}
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] text-indigo-400 uppercase">
            Applications
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            My applications
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Follow every role you applied for, from first click to offer.
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={refresh}
          className="h-9 gap-2 rounded-xl px-3 text-xs text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
              <stat.icon className="size-4" />
            </span>
            <div>
              <p className="text-[11px] tracking-wide text-zinc-500 uppercase">
                {stat.label}
              </p>
              <p className="text-lg font-semibold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          ...statusOrder
            .filter((status) => counts[status])
            .map((status) => ({ value: status, label: statusMeta[status].label })),
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              filter === option.value
                ? "border-indigo-500/40 bg-indigo-500/15 text-white"
                : "border-white/[0.08] bg-white/[0.02] text-zinc-400 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            {option.label}
            <span
              className={cn(
                "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px]",
                filter === option.value
                  ? "bg-white/15 text-white"
                  : "bg-white/[0.06] text-zinc-500"
              )}
            >
              {counts[option.value]}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/[0.04] px-6 py-16 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <Button
              variant="outline"
              onClick={refresh}
              className="mt-4 h-9 rounded-xl border-white/10 bg-transparent text-xs text-zinc-300 hover:bg-white/5"
            >
              Try again
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/[0.03] text-zinc-500 ring-1 ring-white/[0.06]">
              <SearchX className="size-5" />
            </span>
            <p className="mt-3 text-sm font-medium text-white">
              {applications.length === 0
                ? "No applications yet"
                : "Nothing in this status"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {applications.length === 0
                ? "Browse open roles and send your first application."
                : "Try another filter to see the rest."}
            </p>
            {applications.length === 0 ? (
              <Link
                href="/jobs"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "mt-4 gap-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
                )}
              >
                Browse jobs
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
          </div>
        ) : (
          visible.map((application) => (
            <ApplicationCard key={application._id} application={application} />
          ))
        )}
      </div>
    </div>
  );
};

export default SeekerApplicationsPage;
