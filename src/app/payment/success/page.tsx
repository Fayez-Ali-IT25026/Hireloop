import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Mail,
  Receipt,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { checkoutVerify } from "@/lib/actions/payments";
import { stripe } from "@/lib/stripe";
import { cn } from "@/lib/utils";

import CopyButton from "./CopyButton";

// This route reads runtime data (searchParams + Stripe), so it blocks instead
// of prerendering — required by Next's cacheComponents.
export const instant = false;

const formatMoney = (amount: number | null, currency: string | null) => {
  if (amount == null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency ?? "usd").toUpperCase(),
  }).format(amount / 100);
};

const formatDate = (seconds: number) =>
  new Date(seconds * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const Shell = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-zinc-950 text-white">
    <Navbar />

    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-48 left-1/2 size-[38rem] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[130px]" />

      <div className="relative mx-auto max-w-2xl px-4 pt-32 pb-24">
        {children}

        <p className="mt-6 text-center text-xs text-zinc-500">
          Questions about this payment? Email{" "}
          <a
            href="mailto:support@hireloop.com"
            className="text-indigo-400 transition-colors hover:text-indigo-300"
          >
            support@hireloop.com
          </a>
        </p>
      </div>
    </section>
  </main>
);

const Notice = ({ title, description }: { title: string; description: string }) => (
  <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/[0.04] text-zinc-500 ring-1 ring-white/[0.06]">
      <AlertCircle className="size-6" />
    </span>
    <h1 className="mt-4 text-lg font-semibold text-white">{title}</h1>
    <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
    <Link
      href="/payment"
      className={cn(
        buttonVariants(),
        "mt-5 h-10 rounded-xl bg-indigo-600 px-5 text-white hover:bg-indigo-500"
      )}
    >
      Back to checkout
    </Link>
  </div>
);

const Row = ({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <span className="inline-flex items-center gap-2 text-xs text-zinc-500">
      <Icon className="size-3.5" />
      {label}
    </span>
    <span className="text-right text-xs font-medium text-zinc-200">
      {children}
    </span>
  </div>
);

const PaymentSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) => {
  const { session_id } = await searchParams;

  // Everything below depends on the request (session id + Stripe), so stop
  // prerendering here. Stripe's client reads Date.now() while it renders,
  // which Next treats as an unstable value during prerender.
  await connection();

  if (!session_id) {
    return (
      <Shell>
        <Notice
          title="Missing checkout session"
          description="This link is incomplete. Start the payment again from the checkout page."
        />
      </Shell>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items.data.price.product", "payment_intent"],
  });

  if (session.status === "open") {
    redirect("/");
  }

  if (session.status !== "complete" || session.payment_status !== "paid") {
    return (
      <Shell>
        <Notice
          title="Payment not completed"
          description="We couldn't confirm this payment. No charge was made — you can try again whenever you're ready."
        />
      </Shell>
    );
  }

  // Save the payment and mark the user as premium. If the API is down we still
  // show the receipt, because Stripe already confirmed the charge.
  try {
    await checkoutVerify(session_id);
  } catch {
    // Nothing to do — the payment is safe on Stripe's side.
  }

  const item = session.line_items?.data[0];
  const product = item?.price?.product;
  const planName =
    (typeof product === "object" &&
    product !== null &&
    "name" in product
      ? product.name
      : null) ??
    item?.description ??
    "HireLoop plan";

  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const email = session.customer_details?.email ?? session.customer_email;
  const name = session.customer_details?.name;
  const amount = formatMoney(session.amount_total, session.currency);

  return (
    <Shell>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50">
        <div className="relative border-b border-white/[0.06] px-6 py-10 text-center sm:px-10">
          <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-emerald-500/10 blur-3xl" />

          <span className="relative mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
            <CheckCircle2 className="size-8" />
          </span>

          <h1 className="relative mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
            Payment successful
          </h1>
          <p className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
            {name ? `Thanks, ${name}. ` : "Thanks for your payment. "}
            {email ? (
              <>
                A receipt is on its way to{" "}
                <span className="text-white">{email}</span>.
              </>
            ) : (
              "A receipt is on its way to your inbox."
            )}
          </p>

          <div className="relative mt-4 flex items-center justify-center gap-2">
            <Badge className="border-0 bg-emerald-500/10 text-emerald-300">
              <ShieldCheck className="size-3" />
              Paid
            </Badge>
            <span className="text-xs text-zinc-500">{amount}</span>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-10">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-zinc-500 uppercase">
            Payment details
          </p>

          <div className="mt-2 divide-y divide-white/[0.06]">
            <Row icon={Sparkles} label="Plan">
              {planName}
            </Row>
            <Row icon={CreditCard} label="Amount paid">
              {amount}
            </Row>
            <Row icon={CalendarDays} label="Date">
              {formatDate(session.created)}
            </Row>
            {email ? (
              <Row icon={Mail} label="Email">
                <span className="break-all">{email}</span>
              </Row>
            ) : null}
            <Row icon={ShieldCheck} label="Status">
              <span className="text-emerald-300">Paid</span>
            </Row>
          </div>

          <div className="mt-5 rounded-2xl border border-indigo-500/25 bg-indigo-500/[0.07] p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-indigo-300 uppercase">
              <Receipt className="size-3.5" />
              Transaction ID
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <code className="min-w-0 truncate font-mono text-xs text-white">
                {transactionId ?? "—"}
              </code>
              {transactionId ? <CopyButton value={transactionId} /> : null}
            </div>

            <p className="mt-2 text-[11px] text-zinc-500">
              Keep this ID handy if you contact support about this payment.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/seeker"
              className={cn(
                buttonVariants(),
                "h-10 flex-1 gap-2 rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500"
              )}
            >
              Go to dashboard
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/jobs"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 flex-1 rounded-xl border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white"
              )}
            >
              Browse jobs
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default PaymentSuccessPage;
