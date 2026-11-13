"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";

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

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface JobForm {
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
}

interface CollectedJob extends Omit<JobForm, "salaryMin" | "salaryMax"> {
  salaryMin: number | null;
  salaryMax: number | null;
  status: "draft" | "active";
  createdAt: string;
}

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

const currencies = ["USD", "EUR", "GBP", "BDT"].map((value) => ({
  value,
  label: value,
}));

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
        <Label htmlFor={htmlFor} className="text-xs font-medium text-zinc-300">
          {label}
        </Label>
        {hint ? <span className="text-[11px] text-zinc-500">{hint}</span> : null}
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
  const [form, setForm] = useState<JobForm>(initialForm);
  const [collected, setCollected] = useState<CollectedJob | null>(null);

  const update = <K extends keyof JobForm>(key: K, value: JobForm[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

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

  const saveJob = (status: CollectedJob["status"]) => {
    const payload: CollectedJob = {
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      status,
      createdAt: new Date().toISOString(),
    };

    console.log("Collected job data:", payload);
    setCollected(payload);

    toast.success(status === "draft" ? "Draft saved" : "Job published", {
      description: `${payload.title || "Untitled role"} · ${payload.type}`,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveJob("active");
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
            Add the role details once. The preview updates as you type, and the
            collected data is ready to send to your API.
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-white/10 bg-white/[0.03] text-zinc-400"
        >
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Draft mode
        </Badge>
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
                  items={categories}
                  value={form.category}
                  onValueChange={(value) => update("category", value ?? "")}
                >
                  <SelectTrigger
                    id="category"
                    className="h-11 w-full rounded-xl border-white/10 bg-white/[0.03] px-3 text-sm text-white focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
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
                    placeholder="San Francisco, CA"
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
                  items={currencies}
                  value={form.currency}
                  onValueChange={(value) => update("currency", value ?? "")}
                >
                  <SelectTrigger
                    id="currency"
                    className="h-11 w-full rounded-xl border-white/10 bg-white/[0.03] px-3 text-sm text-white focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
                  >
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
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
                <FormField label="Responsibilities" htmlFor="responsibilities">
                  <Textarea
                    id="responsibilities"
                    name="responsibilities"
                    rows={5}
                    value={form.responsibilities}
                    onChange={(event) =>
                      update("responsibilities", event.target.value)
                    }
                    placeholder={"One responsibility per line\nLead design reviews\nShip polished features"}
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
                    placeholder={"One requirement per line\n5+ years of experience\nStrong communication skills"}
                    className={textareaClass}
                  />
                </FormField>
              </div>

              <FormField
                label="Benefits"
                htmlFor="benefits"
                hint="Optional"
              >
                <Textarea
                  id="benefits"
                  name="benefits"
                  rows={3}
                  value={form.benefits}
                  onChange={(event) => update("benefits", event.target.value)}
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
              className="h-10 rounded-xl border-white/10 bg-transparent px-4 hover:bg-white/5"
            >
              Save draft
            </Button>
            <Button
              type="submit"
              className="h-10 gap-2 rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
            >
              <Send className="size-4" />
              Publish job
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

          {collected ? (
            <Card className="gap-3 bg-white/[0.02] py-4 ring-1 ring-white/[0.06]">
              <CardHeader className="px-4">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-sm text-white">
                    Collected data
                  </CardTitle>
                  <Badge className="border-0 bg-emerald-500/10 text-emerald-300 capitalize">
                    {collected.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-4">
                <pre className="max-h-64 overflow-auto rounded-xl border border-white/[0.06] bg-black/40 p-3 text-[11px] leading-relaxed text-zinc-400">
                  {JSON.stringify(collected, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default CreateJobsPage;
