"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import CheckoutPage from "@/components/checkoutPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Change this object to switch the plan shown on the checkout page.
 * Later, the Pay button will create a Stripe Checkout Session with these values.
 */
const plan = {
  name: "Growth",
  price: 17,
  interval: "month",
  features: [
    "Daily AI match brief (top 5)",
    "Verified salary bands",
    "Unlimited 1-click apply",
  ],
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value
  );

const inputClass =
  "h-11 rounded-xl border-white/10 bg-white/[0.03] text-sm text-white placeholder:text-zinc-600 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20";

const labelClass = "text-xs font-medium text-zinc-300";

const steps = [
  { label: "Plan", state: "done" },
  { label: "Payment", state: "active" },
  { label: "Confirmation", state: "todo" },
] as const;

const PaymentPage =  () => {

    
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   // TODO: create a Stripe Checkout Session on the server and redirect here:
  //   // window.location.href = checkoutUrl;
  // };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-48 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />

        <div className="relative mx-auto max-w-5xl px-4 pt-32 pb-24">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to plans
          </Link>

          <p className="mt-6 text-xs font-medium tracking-[0.2em] text-indigo-400 uppercase">
            Checkout
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Complete your <span className="text-indigo-400">payment</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
            You&apos;re one step away from the {plan.name} plan. Confirm your
            details and continue to our secure Stripe checkout.
          </p>

          <div className="mt-6 flex items-center gap-2 text-[11px]">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium",
                    step.state === "done" &&
                      "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                    step.state === "active" &&
                      "border-indigo-500/40 bg-indigo-500/15 text-white",
                    step.state === "todo" &&
                      "border-white/10 bg-white/[0.02] text-zinc-500"
                  )}
                >
                  {step.state === "done" ? (
                    <Check className="size-3" />
                  ) : (
                    <span className="text-[10px]">{index + 1}</span>
                  )}
                  {step.label}
                </span>
                {index < steps.length - 1 ? (
                  <span className="h-px w-6 bg-white/10" />
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                    <CreditCard className="size-4" />
                  </span>
                  <h2 className="text-sm font-semibold text-white">
                    Payment method
                  </h2>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-indigo-500/40 bg-indigo-500/[0.08] p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-indigo-300">
                      <CreditCard className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">
                        Credit or debit card
                      </p>
                      <p className="text-xs text-zinc-400">
                        Card details are entered on Stripe&apos;s secure page.
                      </p>
                    </div>
                  </div>

                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-indigo-500 text-white">
                    <Check className="size-3" />
                  </span>
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <Lock className="size-3" />
                  We never see or store your card number.
                </p>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                    <User className="size-4" />
                  </span>
                  <h2 className="text-sm font-semibold text-white">
                    Billing details
                  </h2>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="full-name" className={labelClass}>
                      Full name
                    </Label>
                    <Input
                      id="full-name"
                      name="name"
                      placeholder="Fayez Ali"
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className={labelClass}>
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-600" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        className={cn(inputClass, "pl-9")}
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-zinc-500">
                  We&apos;ll email your receipt and invoice to this address.
                </p>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/40">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white">
                    Order summary
                  </h2>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] font-medium text-zinc-400 capitalize">
                    Per {plan.interval}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
                    <Sparkles className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {plan.name} plan
                    </p>
                    <p className="text-xs text-zinc-500">
                      Billed every {plan.interval}
                    </p>
                  </div>
                  <span className="ml-auto text-sm font-semibold text-white">
                    {money(plan.price)}
                  </span>
                </div>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-xs text-zinc-400"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-indigo-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 space-y-2 border-t border-white/[0.08] pt-4 text-sm">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Subtotal</span>
                    <span>{money(plan.price)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-base font-semibold text-white">
                    <span>Total due today</span>
                    <span>{money(plan.price)}</span>
                  </div>
                </div>

               <CheckoutPage  price={plan.price} />

                <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-500">
                  You&apos;ll be redirected to Stripe&apos;s secure checkout to
                  finish the payment.
                </p>

                <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-white/[0.08] pt-4 text-[11px] text-zinc-500">
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  Secured by Stripe · Cancel anytime
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PaymentPage;
