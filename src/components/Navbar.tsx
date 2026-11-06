import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
];

const Navbar = () => {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 shadow-lg shadow-black/30 backdrop-blur-xl">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          hire<span className="text-indigo-400">loop</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

       <div className="flex items-center gap-2">
  <Link
    href="/signin"
    className="rounded-full px-4 py-2 text-sm text-zinc-300 hover:bg-white/10 hover:text-white"
  >
    Sign in
  </Link>

  <Link
    href="/signup"
    className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
  >
    Get Started
  </Link>
</div>
      </nav>
    </header>
  );
};

export default Navbar;