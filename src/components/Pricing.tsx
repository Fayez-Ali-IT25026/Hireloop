"use client";

import { useState } from "react";
import { BarChart3, Crown, Plus, Zap, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    icon: Crown,
    price: 0,
    featured: false,
    features: ["Daily AI match brief (top 5)", "Verified salary bands", "Company insight dashboards", "1-click apply, unlimited"],
  },
  {
    name: "Growth",
    icon: BarChart3,
    price: 17,
    featured: true,
    features: ["Daily AI match brief (top 5)", "Verified salary bands", "Company insight dashboards", "1-click apply, unlimited"],
  },
  {
    name: "Premium",
    icon: Zap,
    price: 99,
    featured: false,
    features: ["Everything in Pro", "Multi-profile career portfolios", "Shared talent rooms", "Recruiter view (read-only)"],
  },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="mx-auto max-w-5xl px-4 pb-28">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">Pricing</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Pay for the leverage, <br /> not the listings
        </h2>

        {/* toggle */}
        <div className="mx-auto mt-8 flex w-fit rounded-full border border-white/10 bg-white/5 p-1 text-xs">
          <button
            onClick={() => setYearly(false)}
            className={`rounded-full px-4 py-1.5 transition ${!yearly ? "bg-white text-black" : "text-zinc-400"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 transition ${yearly ? "bg-white text-black" : "text-zinc-400"}`}
          >
            Yearly
            <span className="rounded-full bg-fuchsia-500 px-1.5 py-0.5 text-[10px] text-white">25%</span>
          </button>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {plans.map(({ name, icon: Icon, price, featured, features }) => {
          const shown = yearly ? Math.round(price * 0.75) : price;
          return (
            <div
              key={name}
              className={`rounded-2xl border p-6 transition ${
                featured
                  ? "border-white/25 bg-white/[0.07] shadow-2xl shadow-indigo-950/50 md:-translate-y-2"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white">
                  <Icon className="size-4 text-indigo-400" />
                  {name}
                </div>
                <p className="text-white">
                  <span className="text-3xl font-bold">${shown}</span>
                  <span className="text-xs text-zinc-500"> /month</span>
                </p>
              </div>

              <p className="mt-6 text-xs font-medium text-white">Start building your insights hub:</p>
              <ul className="mt-4 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-xs text-zinc-400">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <Plus className="size-3 text-zinc-300" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 flex h-10 w-full items-center justify-between rounded-lg px-4 text-xs font-medium transition ${
                  featured ? "bg-white text-black hover:bg-zinc-200" : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                Choose This Plan <ArrowRight className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Pricing;