import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="relative overflow-hidden py-32 text-center">
      {/* dome glow + grid */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[900px] w-[1400px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,#4f46e5_0%,#1e1b4b_45%,transparent_70%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[url('/cta-bg.png')] bg-cover bg-top opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="relative mx-auto max-w-2xl px-4">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Your next role is <br /> already looking for you
        </h2>
        <p className="mt-4 text-sm text-zinc-300">
          Build a profile in three minutes. The matches start arriving tomorrow morning.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button className="rounded-lg bg-white px-5 text-black hover:bg-zinc-200">Create a free account</Button>
          <Button variant="outline" className="rounded-lg border-white/20 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white">
            View pricing
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;