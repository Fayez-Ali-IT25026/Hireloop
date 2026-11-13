"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  Eye,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { deleteJob, getJobs, updateJob } from "@/lib/api/jobs";
import { cn } from "@/lib/utils";
import type { Job } from "@/types/job";

const categories = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "finance", label: "Finance" },
  { value: "support", label: "Customer Support" },
  { value: "other", label: "Other" },
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
];

const inputClass =
  "h-10 rounded-xl border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20";

const labelClass = "text-xs font-medium text-zinc-300";

type EditForm = {
  title: string;
  category: string;
  type: string;
  location: string;
  remote: boolean;
  deadline: string;
  currency: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  status: "active" | "draft";
};

const emptyEditForm: EditForm = {
  title: "",
  category: "engineering",
  type: "Full-time",
  location: "",
  remote: false,
  deadline: "",
  currency: "USD",
  salaryMin: "",
  salaryMax: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  status: "active",
};

const formatDate = (value: string) => {
  if (!value) return "—";
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatSalary = (job: Job) => {
  if (job.salaryMin == null && job.salaryMax == null) return "Not specified";

  const number = (value: number) => new Intl.NumberFormat("en-US").format(value);

  if (job.salaryMin != null && job.salaryMax != null) {
    return `${job.currency} ${number(job.salaryMin)} – ${number(job.salaryMax)}`;
  }

  return `${job.currency} ${number(job.salaryMin ?? job.salaryMax ?? 0)}`;
};

const categoryLabel = (value: string) =>
  categories.find((category) => category.value === value)?.label ?? value;

const toEditForm = (job: Job): EditForm => ({
  title: job.title ?? "",
  category: job.category ?? "engineering",
  type: job.type ?? "Full-time",
  location: job.location ?? "",
  remote: Boolean(job.remote),
  deadline: job.deadline ?? "",
  currency: job.currency ?? "USD",
  salaryMin: job.salaryMin != null ? String(job.salaryMin) : "",
  salaryMax: job.salaryMax != null ? String(job.salaryMax) : "",
  description: job.description ?? "",
  responsibilities: job.responsibilities ?? "",
  requirements: job.requirements ?? "",
  benefits: job.benefits ?? "",
  status: job.status === "draft" ? "draft" : "active",
});

const ManageJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadJobs = useCallback(async () => {
    try {
      const data = await getJobs();
      setJobs(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setError("Could not load jobs. Make sure the API server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load. State is only updated after the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadJobs();
  }, [loadJobs]);

  const refresh = () => {
    setError("");
    setLoading(true);
    void loadJobs();
  };

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return jobs;

    return jobs.filter((job) =>
      [job.title, job.location, job.category, job.type]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [jobs, search]);

  const activeCount = jobs.filter((job) => job.status === "active").length;
  const remoteCount = jobs.filter((job) => job.remote).length;

  const openEdit = (job: Job) => {
    setEditJob(job);
    setEditForm(toEditForm(job));
  };

  const updateField = <K extends keyof EditForm>(
    key: K,
    value: EditForm[K]
  ) => setEditForm((previous) => ({ ...previous, [key]: value }));

  const saveChanges = async () => {
    if (!editJob) return;

    setSaving(true);

    try {
      await updateJob(editJob._id, {
        ...editForm,
        salaryMin: editForm.salaryMin ? Number(editForm.salaryMin) : null,
        salaryMax: editForm.salaryMax ? Number(editForm.salaryMax) : null,
      });

      setJobs((previous) =>
        previous.map((job) =>
          job._id === editJob._id
            ? {
                ...job,
                ...editForm,
                salaryMin: editForm.salaryMin ? Number(editForm.salaryMin) : null,
                salaryMax: editForm.salaryMax ? Number(editForm.salaryMax) : null,
              }
            : job
        )
      );

      toast.success("Job updated", { description: editForm.title });
      setEditJob(null);
    } catch {
      toast.error("Update failed", {
        description: "The job could not be updated.",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteJob(deleteTarget._id);
      setJobs((previous) =>
        previous.filter((job) => job._id !== deleteTarget._id)
      );
      toast.success("Job deleted", { description: deleteTarget.title });
      setDeleteTarget(null);
    } catch {
      toast.error("Delete failed", {
        description: "The job could not be deleted.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Manage jobs
          </h1>
          <p className="max-w-xl text-sm text-zinc-400">
            Review every role you have posted, update the details, or remove
            jobs you no longer need.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/new"
          className={cn(
            buttonVariants({ size: "default" }),
            "h-10 gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
          )}
        >
          <Plus className="size-4" />
          New job
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total jobs", value: jobs.length, icon: Briefcase },
          { label: "Active", value: activeCount, icon: CalendarDays },
          { label: "Remote", value: remoteCount, icon: MapPin },
        ].map((stat) => (
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

      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs by title, location..."
              className={cn(inputClass, "h-9 pl-9")}
            />
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

        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              {["Role", "Type", "Salary", "Status", "Deadline", "Actions"].map(
                (heading) => (
                  <TableHead
                    key={heading}
                    className={cn(
                      "h-10 px-4 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase",
                      heading === "Actions" && "text-right"
                    )}
                  >
                    {heading}
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <TableRow
                  key={index}
                  className="border-white/[0.06] hover:bg-transparent"
                >
                  {Array.from({ length: 6 }).map((__, cell) => (
                    <TableCell key={cell} className="px-4 py-4">
                      <div className="h-4 w-full max-w-40 animate-pulse rounded bg-white/[0.06]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="px-4 py-16 text-center">
                  <p className="text-sm text-red-400">{error}</p>
                  <Button
                    variant="outline"
                    onClick={refresh}
                    className="mt-4 h-9 rounded-xl border-white/10 bg-transparent text-xs text-zinc-300 hover:bg-white/5"
                  >
                    Try again
                  </Button>
                </TableCell>
              </TableRow>
            ) : filteredJobs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="px-4 py-16 text-center">
                  <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white/[0.03] text-zinc-500 ring-1 ring-white/[0.06]">
                    <Briefcase className="size-5" />
                  </span>
                  <p className="mt-3 text-sm font-medium text-white">
                    {jobs.length === 0 ? "No jobs yet" : "No matching jobs"}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {jobs.length === 0
                      ? "Create your first job to start hiring."
                      : "Try a different search term."}
                  </p>
                  {jobs.length === 0 ? (
                    <Link
                      href="/dashboard/recruiter/jobs/new"
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "mt-4 gap-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
                      )}
                    >
                      <Plus className="size-3.5" />
                      New job
                    </Link>
                  ) : null}
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow
                  key={job._id}
                  className="border-white/[0.06] hover:bg-white/[0.03]"
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-indigo-400 ring-1 ring-white/[0.06]">
                        <Briefcase className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                          {job.title}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {categoryLabel(job.category)}
                          {job.location ? ` · ${job.location}` : ""}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Badge className="border-0 bg-white/[0.06] text-zinc-300">
                      {job.type}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm whitespace-nowrap text-zinc-400">
                    {formatSalary(job)}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <Badge
                      className={cn(
                        "border-0 capitalize",
                        job.status === "active"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-amber-500/10 text-amber-300"
                      )}
                    >
                      {job.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-sm whitespace-nowrap text-zinc-400">
                    {formatDate(job.deadline)}
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="View job"
                        aria-label={`View ${job.title}`}
                        onClick={() => setViewJob(job)}
                        className="rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Update job"
                        aria-label={`Update ${job.title}`}
                        onClick={() => openEdit(job)}
                        className="rounded-lg text-zinc-400 hover:bg-indigo-500/15 hover:text-indigo-300"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Delete job"
                        aria-label={`Delete ${job.title}`}
                        onClick={() => setDeleteTarget(job)}
                        className="rounded-lg text-zinc-400 hover:bg-red-500/15 hover:text-red-300"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View dialog */}
      <Dialog
        open={Boolean(viewJob)}
        onOpenChange={(open) => !open && setViewJob(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto border border-white/10 bg-[#0b0b0f] p-6 text-white ring-white/10 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              {viewJob?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              {viewJob
                ? `${categoryLabel(viewJob.category)} · ${viewJob.type}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {viewJob ? (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  className={cn(
                    "border-0 capitalize",
                    viewJob.status === "active"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-amber-500/10 text-amber-300"
                  )}
                >
                  {viewJob.status}
                </Badge>
                {viewJob.remote ? (
                  <Badge className="border-0 bg-indigo-500/10 text-indigo-300">
                    Remote
                  </Badge>
                ) : null}
                <Badge className="border-0 bg-white/[0.06] text-zinc-300">
                  {categoryLabel(viewJob.category)}
                </Badge>
              </div>

              <div className="grid gap-3 rounded-xl border border-white/[0.06] bg-black/30 p-4 text-xs sm:grid-cols-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="size-3.5 text-zinc-500" />
                  {viewJob.location || "Location not specified"}
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Wallet className="size-3.5 text-zinc-500" />
                  {formatSalary(viewJob)}
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <CalendarDays className="size-3.5 text-zinc-500" />
                  Apply by {formatDate(viewJob.deadline)}
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Briefcase className="size-3.5 text-zinc-500" />
                  Posted {formatDate(viewJob.createdAt)}
                </div>
              </div>

              {[
                { title: "Description", value: viewJob.description },
                { title: "Responsibilities", value: viewJob.responsibilities },
                { title: "Requirements", value: viewJob.requirements },
                { title: "Benefits", value: viewJob.benefits },
              ]
                .filter((section) => section.value)
                .map((section) => (
                  <div key={section.title}>
                    <h3 className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
                      {section.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line text-zinc-300">
                      {section.value}
                    </p>
                  </div>
                ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Update dialog */}
      <Dialog
        open={Boolean(editJob)}
        onOpenChange={(open) => !open && setEditJob(null)}
      >
        <DialogContent className="max-h-[88vh] overflow-y-auto border border-white/10 bg-[#0b0b0f] p-6 text-white ring-white/10 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              Update job
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Edit the details and save your changes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-title" className={labelClass}>
                Job title
              </Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category" className={labelClass}>
                Category
              </Label>
              <Select
                items={categories}
                value={editForm.category}
                onValueChange={(value) => updateField("category", value ?? "")}
              >
                <SelectTrigger
                  id="edit-category"
                  className="h-10 w-full rounded-xl border-white/10 bg-white/[0.03] px-3 text-sm text-white focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-type" className={labelClass}>
                Job type
              </Label>
              <Select
                items={jobTypes.map((type) => ({ value: type, label: type }))}
                value={editForm.type}
                onValueChange={(value) => updateField("type", value ?? "")}
              >
                <SelectTrigger
                  id="edit-type"
                  className="h-10 w-full rounded-xl border-white/10 bg-white/[0.03] px-3 text-sm text-white focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location" className={labelClass}>
                Location
              </Label>
              <Input
                id="edit-location"
                value={editForm.location}
                onChange={(event) => updateField("location", event.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-deadline" className={labelClass}>
                Deadline
              </Label>
              <Input
                id="edit-deadline"
                type="date"
                value={editForm.deadline}
                onChange={(event) => updateField("deadline", event.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-salary-min" className={labelClass}>
                Salary min
              </Label>
              <Input
                id="edit-salary-min"
                type="number"
                min={0}
                value={editForm.salaryMin}
                onChange={(event) =>
                  updateField("salaryMin", event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-salary-max" className={labelClass}>
                Salary max
              </Label>
              <Input
                id="edit-salary-max"
                type="number"
                min={0}
                value={editForm.salaryMax}
                onChange={(event) =>
                  updateField("salaryMax", event.target.value)
                }
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status" className={labelClass}>
                Status
              </Label>
              <Select
                items={statusOptions}
                value={editForm.status}
                onValueChange={(value) =>
                  updateField("status", value === "draft" ? "draft" : "active")
                }
              >
                <SelectTrigger
                  id="edit-status"
                  className="h-10 w-full rounded-xl border-white/10 bg-white/[0.03] px-3 text-sm text-white focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between gap-4 self-end rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2">
              <div>
                <p className="text-sm font-medium text-white">Remote</p>
                <p className="text-[11px] text-zinc-500">Work from anywhere</p>
              </div>
              <Switch
                checked={editForm.remote}
                onCheckedChange={(checked) => updateField("remote", checked)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-description" className={labelClass}>
                Description
              </Label>
              <Textarea
                id="edit-description"
                rows={3}
                value={editForm.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="min-h-20 rounded-xl border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-responsibilities" className={labelClass}>
                Responsibilities
              </Label>
              <Textarea
                id="edit-responsibilities"
                rows={3}
                value={editForm.responsibilities}
                onChange={(event) =>
                  updateField("responsibilities", event.target.value)
                }
                className="min-h-20 rounded-xl border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-requirements" className={labelClass}>
                Requirements
              </Label>
              <Textarea
                id="edit-requirements"
                rows={3}
                value={editForm.requirements}
                onChange={(event) =>
                  updateField("requirements", event.target.value)
                }
                className="min-h-20 rounded-xl border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-benefits" className={labelClass}>
                Benefits
              </Label>
              <Textarea
                id="edit-benefits"
                rows={2}
                value={editForm.benefits}
                onChange={(event) => updateField("benefits", event.target.value)}
                className="min-h-16 rounded-xl border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
            <Button
              variant="outline"
              onClick={() => setEditJob(null)}
              className="h-10 rounded-xl border-white/10 bg-transparent px-4 text-zinc-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={saveChanges}
              disabled={saving}
              className="h-10 rounded-xl bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-500"
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="border border-white/10 bg-[#0b0b0f] p-6 text-white ring-white/10 sm:max-w-md">
          <DialogHeader>
            <span className="grid size-10 place-items-center rounded-xl bg-red-500/10 text-red-400 ring-1 ring-red-500/20">
              <AlertTriangle className="size-5" />
            </span>
            <DialogTitle className="text-lg font-semibold text-white">
              Delete this job?
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              <span className="font-medium text-white">
                {deleteTarget?.title}
              </span>{" "}
              will be permanently removed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="h-10 rounded-xl border-white/10 bg-transparent px-4 text-zinc-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="h-10 rounded-xl bg-red-600 px-5 font-semibold text-white hover:bg-red-500"
            >
              {deleting ? "Deleting..." : "Delete job"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageJobsPage;
