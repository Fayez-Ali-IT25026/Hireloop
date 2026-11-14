"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const categories = [
  { value: "all", label: "All categories" },
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
  { value: "data-science", label: "Data Science" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "finance", label: "Finance" },
  { value: "support", label: "Customer Support" },
  { value: "other", label: "Other" },
];

const jobTypes = [
  { value: "all", label: "All types" },
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Remote", label: "Remote" },
];

const triggerClass =
  "h-10 w-full rounded-xl border-white/10 bg-black/40 px-3 text-sm text-white focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20 sm:w-52";

const JobFilters = () => {
      const router = useRouter()
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  const hasFilters =
    search.trim() !== "" || category !== "all" || type !== "all";












//   // Query wiring is intentionally left empty — connect these to the API / URL.
//   const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);
//     const data = Object.fromEntries(formData.entries());
//     console.log("Search submitted:", data);
//     //search came from input name fild
//    const search = data.search;   
//  const params = new URLSearchParams()
//         params.set('search', search as string);
//         router.push(`/jobs?${params.toString()}`)




//   };

const onSearch = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries(formData.entries());

  console.log("Search submitted:", data);

  const params = new URLSearchParams();

  params.set("search", data.search as string);

  if (category !== "all") {
    params.set("category", category);
  }

  if (type !== "all") {
    params.set("jobType", type);
  }

  router.push(`/jobs?${params.toString()}`);
};













const onFilterChange = (
  newCategory = category,
  newType = type
) => {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (newCategory !== "all") {
    params.set("category", newCategory);
  }

  if (newType !== "all") {
    params.set("jobType", newType);
  }

  router.push(`/jobs?${params.toString()}`);
};














  // const clearFilters = () => {
  //   setSearch("");
  //   setCategory("all");
  //   setType("all");
  //   onFilterChange();
  // };
const clearFilters = () => {
  setSearch("");
  setCategory("all");
  setType("all");

  router.push("/jobs");
};






  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-4">
      <form
       onSubmit={onSearch}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
          <Input
           name="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by role, location, or keyword..."
            aria-label="Search jobs"
            className="h-12 rounded-2xl border-white/10 bg-black/40 pr-4 pl-11 text-sm text-white placeholder:text-zinc-500 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
          />
        </div>

        <Button
          type="submit"
          className="h-12 shrink-0 gap-2 rounded-2xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
        >
          <Search className="size-4" />
          Search
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
        <span className="flex items-center gap-1.5 pr-1 text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase">
          <Filter className="size-3.5" />
          Filters
        </span>

        <Select
          items={categories}
          name="category"
          value={category}
          // onValueChange={(value) => {
          //   setCategory(value ?? "all");
          //   onFilterChange();
          // }}
          onValueChange={(value) => {
  const newValue = value ?? "all";
  setCategory(newValue);
  onFilterChange(newValue, type);
}}
        >
          <SelectTrigger aria-label="Filter by category" className={triggerClass}>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent className="dark rounded-xl border border-white/10">
            {categories.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          items={jobTypes}
          name="jobType"
          value={type}
          // onValueChange={(value) => {
          //   setType(value ?? "all");
          //   onFilterChange();
          // }}
          onValueChange={(value) => {
  const newValue = value ?? "all";
  setType(newValue);
  onFilterChange(category, newValue);
}}
        >
          <SelectTrigger aria-label="Filter by job type" className={triggerClass}>
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent className="dark rounded-xl border border-white/10">
            {jobTypes.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            onClick={clearFilters}
            className="h-10 gap-1.5 rounded-xl px-3 text-xs text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <X className="size-3.5" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default JobFilters;
