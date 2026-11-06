import { Activity, Bookmark, Building2, FileText, MousePointerClick, Search, TrendingUp, Wallet } from "lucide-react";

const features = [
  { icon: Search, title: "Smart Search", text: "Find jobs faster with advanced filters." },
  { icon: Wallet, title: "Salary Insights", text: "Get real market salary data instantly." },
  { icon: Building2, title: "Top Companies", text: "Apply to verified, top hiring companies." },
  { icon: Bookmark, title: "Saved Jobs", text: "Save listings and revisit them anytime." },
  { icon: MousePointerClick, title: "One-Click Apply", text: "Apply to jobs with a single click." },
  { icon: FileText, title: "Resume Builder", text: "Create a professional resume in minutes." },
  { icon: Activity, title: "Skill Tracking", text: "Track the skills employers want most." },
  { icon: TrendingUp, title: "Career Growth", text: "Guides and tips to grow your career." },
];

const Features = () => {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-28">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">Features</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Everything you need <br /> to succeed
        </h2>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-500/40 hover:bg-white/[0.06]"
          >
            <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500/30 to-violet-500/10 text-indigo-300">
              <Icon className="size-5" />
            </span>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;