"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
// CHANGE: import the router so we can leave the page after saving.
import { useRouter } from "next/navigation";
import type { CreateJobPayload } from "@/types/job";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CircleDollarSign,
  FileText,
  MapPin,
  Send,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createJob } from "@/lib/actions/jobs";

interface JobForm {
  title: string;
  category: string;
  companyId?: string;
  recruiterId: string;
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
}

// CHANGE: removed the CollectedJob type.
// WHY: it only described the debug JSON panel, which is gone now that saving
// actually calls the API.

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

const currencies = ["USD", "EUR", "GBP", "BDT"];

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Remote",
];

const initialForm: JobForm = {
  title: "",
  category: "engineering",
  recruiterId: "",
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
};

const inputClass =
  "h-11 rounded-xl border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20";

const textareaClass =
  "min-h-28 rounded-xl border-white/10 bg-white/[0.03] text-sm leading-relaxed text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20";

function FormField({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label
          htmlFor={htmlFor}
          className="text-xs font-medium text-zinc-300"
        >
          {label}
        </Label>
        {hint ? (
          <span className="text-[11px] text-zinc-500">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-white/[0.06] px-5 py-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
        <Icon className="size-4" />
      </span>
      <div>
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

const CreateJobsPage = () => {
  // All React hooks must be called inside this component.
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // CHANGE: used to return to the jobs list after saving.
  const router = useRouter();

  const [form, setForm] = useState<JobForm>(initialForm);
  // CHANGE: removed the `collected` state and its JSON panel.
  // WHY: it was debug output. The job now really goes to the API instead.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CHANGE: removed the useEffect that copied the session id into the form.
  // WHY: saveJob() already sets recruiterId from the session when it sends the
  // request, so the effect was redundant and caused an extra re-render.

  const update = <K extends keyof JobForm>(key: K, value: JobForm[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const categoryLabel =
    categories.find((category) => category.value === form.category)?.label ??
    "Category";

  const salary =
    form.salaryMin || form.salaryMax
      ? `${form.currency} ${form.salaryMin || "0"} – ${form.salaryMax || "Max"}`
      : "Salary not specified";

  const deadline = form.deadline
    ? new Date(`${form.deadline}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No deadline";

  // CHANGE: one save function for both buttons, and it really calls the API.
  // WHY: "Save draft" used to only update local state, so drafts were never
  // stored, and "Publish" always forced status "active".
  const saveJob = async (status: "draft" | "active") => {
    if (!user?.id) {
      toast.error("You must be signed in to save a job.");
      return;
    }

    // CHANGE: small checks before sending anything.
    if (status === "active" && !form.title.trim()) {
      toast.error("Add a job title first.");
      return;
    }

    if (status === "active" && !form.description.trim()) {
      toast.error("Add a description first.");
      return;
    }

    const salaryMin = form.salaryMin ? Number(form.salaryMin) : null;
    const salaryMax = form.salaryMax ? Number(form.salaryMax) : null;

    if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
      toast.error("Minimum salary cannot be higher than the maximum.");
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData: CreateJobPayload = {
        ...form,
        recruiterId: user.id,
        salaryMin,
        salaryMax,
        status,
        createdAt: new Date().toISOString(),
      };

      await createJob(jobData);

      toast.success(status === "draft" ? "Draft saved" : "Job published");

      // CHANGE: return to the list after saving.
      // WHY: staying here kept the old values, so clicking Publish twice
      // created duplicate jobs.
      router.push("/dashboard/recruiter/jobs");
      router.refresh();
    } catch {
      toast.error(
        status === "draft" ? "Could not save draft." : "Could not publish job."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      toast.error("Please wait while your session loads.");
      return;
    }

    await saveJob("active");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to jobs
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Create a new job
          </h1>

          <p className="max-w-xl text-sm text-zinc-400">
            Add the role details once. The preview updates as you type.
          </p>
        </div>

        {/* CHANGE: removed the "Draft mode" badge.
            WHY: it said the page was in draft mode, but Publish always saved an
            active job. The badge was misleading. */}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="gap-0 overflow-hidden bg-white/[0.02] py-0 ring-1 ring-white/[0.06]">
            <SectionHeader
              icon={Briefcase}
              title="Role details"
              description="The basics candidates will see first."
            />

            <CardContent className="grid gap-5 p-5 sm:grid-cols-2">
              <FormField
                label="Job title"
                htmlFor="title"
                className="sm:col-span-2"
              >
                <Input
                  id="title"
                  name="title"
                  required
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="e.g. Senior Product Designer"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Category" htmlFor="category">
                <Select
                  value={form.category}
                  // CHANGE: "?? ''" because the select can emit null.
                  onValueChange={(value) => update("category", value ?? "")}
                >
                  <SelectTrigger
                    id="category"
                    className="h-11 w-full rounded-xl border-white/10 bg-white/[0.03] px-3 text-sm text-white"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  {/* CHANGE: "dark" keeps the portaled menu dark on this page. */}
                  <SelectContent className="dark">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Location" htmlFor="location">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={(event) =>
                      update("location", event.target.value)
                    }
                    placeholder="e.g. Dhaka, Bangladesh"
                    className={cn(inputClass, "pl-9")}
                  />
                </div>
              </FormField>

              <FormField label="Job type" className="sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => {
                    const selected = form.type === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => update("type", type)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                          selected
                            ? "border-indigo-500/40 bg-indigo-500/15 text-indigo-300 shadow-[0_0_0_1px_rgba(99,102,241,0.15)]"
                            : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white"
                        )}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </FormField>

              <FormField label="Application deadline" htmlFor="deadline">
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(event) =>
                    update("deadline", event.target.value)
                  }
                  className={inputClass}
                />
              </FormField>

              <div className="flex items-center justify-between gap-4 self-end rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-white">Remote</p>
                  <p className="text-[11px] text-zinc-500">
                    Can be done from anywhere
                  </p>
                </div>
                <Switch
                  checked={form.remote}
                  onCheckedChange={(checked) => update("remote", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="gap-0 overflow-hidden bg-white/[0.02] py-0 ring-1 ring-white/[0.06]">
            <SectionHeader
              icon={Wallet}
              title="Compensation"
              description="Give candidates a clear salary range."
            />

            <CardContent className="grid gap-5 p-5 sm:grid-cols-3">
              <FormField label="Currency" htmlFor="currency">
                <Select
                  value={form.currency}
                  // CHANGE: "?? ''" because the select can emit null.
                  onValueChange={(value) => update("currency", value ?? "")}
                >
                  <SelectTrigger
                    id="currency"
                    className="h-11 w-full rounded-xl border-white/10 bg-white/[0.03] px-3 text-sm text-white"
                  >
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="dark">
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Minimum" htmlFor="salaryMin">
                <Input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={form.salaryMin}
                  onChange={(event) =>
                    update("salaryMin", event.target.value)
                  }
                  placeholder="80,000"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Maximum" htmlFor="salaryMax">
                <Input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={form.salaryMax}
                  onChange={(event) =>
                    update("salaryMax", event.target.value)
                  }
                  placeholder="120,000"
                  className={inputClass}
                />
              </FormField>
            </CardContent>
          </Card>

          <Card className="gap-0 overflow-hidden bg-white/[0.02] py-0 ring-1 ring-white/[0.06]">
            <SectionHeader
              icon={FileText}
              title="Job description"
              description="Explain the role, expectations, and perks."
            />

            <CardContent className="space-y-5 p-5">
              <FormField label="Overview" htmlFor="description">
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={form.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                  placeholder="Tell candidates what this role is about and why it matters."
                  className={textareaClass}
                />
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  label="Responsibilities"
                  htmlFor="responsibilities"
                >
                  <Textarea
                    id="responsibilities"
                    name="responsibilities"
                    rows={5}
                    value={form.responsibilities}
                    onChange={(event) =>
                      update("responsibilities", event.target.value)
                    }
                    placeholder={
                      "One responsibility per line\nLead design reviews\nShip polished features"
                    }
                    className={textareaClass}
                  />
                </FormField>

                <FormField label="Requirements" htmlFor="requirements">
                  <Textarea
                    id="requirements"
                    name="requirements"
                    rows={5}
                    value={form.requirements}
                    onChange={(event) =>
                      update("requirements", event.target.value)
                    }
                    placeholder={
                      "One requirement per line\n5+ years of experience\nStrong communication skills"
                    }
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <FormField label="Benefits" htmlFor="benefits" hint="Optional">
                <Textarea
                  id="benefits"
                  name="benefits"
                  rows={3}
                  value={form.benefits}
                  onChange={(event) =>
                    update("benefits", event.target.value)
                  }
                  placeholder="Health insurance, remote stipend, unlimited PTO..."
                  className={textareaClass}
                />
              </FormField>
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/dashboard/recruiter/jobs"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 rounded-xl border-white/10 bg-transparent px-4 hover:bg-white/5"
              )}
            >
              Cancel
            </Link>

            <Button
              type="button"
              variant="outline"
              onClick={() => saveJob("draft")}
              // CHANGE: also disable while saving, so it can't double-submit.
              disabled={isPending || isSubmitting || !user?.id}
              className="h-10 rounded-xl border-white/10 bg-transparent px-4 hover:bg-white/5"
            >
              Save draft
            </Button>

            <Button
              type="submit"
              disabled={isPending || isSubmitting || !user?.id}
              className="h-10 gap-2 rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
            >
              <Send className="size-4" />
              {isSubmitting ? "Saving..." : "Publish job"}
            </Button>
          </div>
        </form>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
              Live preview
            </p>
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
              Updating
            </span>
          </div>

          <Card className="gap-0 overflow-hidden bg-white/[0.03] py-0 ring-1 ring-white/[0.08]">
            <div className="relative h-20 overflow-hidden bg-gradient-to-br from-indigo-600/40 via-violet-600/20 to-transparent">
              <div className="absolute -top-12 -right-8 size-40 rounded-full bg-indigo-500/30 blur-3xl" />
            </div>

            <div className="px-5 pb-5">
              <div className="-mt-8 mb-4 grid size-14 place-items-center rounded-2xl bg-[#0b0b0f] shadow-lg ring-1 ring-white/10">
                <Building2 className="size-6 text-indigo-400" />
              </div>

              <h2 className="text-lg font-semibold text-white">
                {form.title || "Untitled role"}
              </h2>

              <p className="mt-0.5 text-xs text-zinc-500">
                Your Company ·{" "}
                {form.remote ? "Remote" : form.location || "Location TBD"}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge className="border-0 bg-indigo-500/10 text-indigo-300">
                  {form.type}
                </Badge>
                <Badge className="border-0 bg-white/[0.06] text-zinc-300">
                  {categoryLabel}
                </Badge>
                {form.remote ? (
                  <Badge className="border-0 bg-emerald-500/10 text-emerald-300">
                    Remote
                  </Badge>
                ) : null}
              </div>

              <div className="mt-4 grid gap-2 rounded-xl border border-white/[0.06] bg-black/30 p-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <CircleDollarSign className="size-3.5 text-zinc-500" />
                  {salary}
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <CalendarDays className="size-3.5 text-zinc-500" />
                  Apply by {deadline}
                </div>
              </div>

              <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-zinc-500">
                {form.description ||
                  "Add a description and it will appear here as you type."}
              </p>
            </div>
          </Card>

          <div className="flex gap-3 rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.06] p-4">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-indigo-400" />
            <p className="text-xs leading-relaxed text-zinc-400">
              <span className="font-medium text-white">Tip:</span> roles with a
              salary range and a clear deadline get noticeably more qualified
              applicants.
            </p>
          </div>

          {/* CHANGE: removed the "Collected data" panel.
              WHY: it printed the raw JSON payload on screen. It was debug
              scaffolding, not part of the page. */}
        </aside>
      </div>
    </div>
  );
};

export default CreateJobsPage;
