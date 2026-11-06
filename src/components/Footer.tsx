import Image from "next/image";
import Link from "next/link";

const columns = [
  { title: "Product", links: ["Job Discovery", "Market AI", "Companies", "Salary Data"] },
  { title: "Navigation", links: ["Help Center", "Career Library", "Contact"] },
  { title: "Resources", links: ["Brand Guideline", "Newsroom"] },
];

const socials = [
  { label: "Facebook", path: "M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.5 1.5-3.9 3.800-3.900 1.100 0 2.200.2 2.200.2v2.500h-1.300c-1.200 0-1.600.8-1.600 1.600V12h2.800l-.4 2.900h-2.400v7A10 10 0 0 0 22 12z" },
  { label: "LinkedIn", path: "M20.400 20.500h-3.600v-5.600c0-1.300 0-3-1.800-3s-2.100 1.400-2.100 2.900v5.700H9.400V9h3.400v1.600c.5-.9 1.600-1.800 3.400-1.800 3.600 0 4.300 2.400 4.300 5.500v6.200zM5.300 7.400a2.100 2.100 0 1 1 0-4.200 2.100 2.100 0 0 1 0 4.200zM7.100 20.500H3.500V9h3.600v11.500z" },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Image src="/logo.png" alt="hireloop" width={110} height={32} />
          <p className="mt-4 max-w-[220px] text-xs leading-relaxed text-zinc-500">
            The AI-native career platform. Built for people and roles that work seamlessly.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="flex size-8 items-center justify-center rounded-full bg-white/10 text-zinc-300 transition hover:bg-indigo-600 hover:text-white">
                <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-medium text-indigo-400">{col.title}</h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-xs text-zinc-500 transition hover:text-white">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-5 text-[11px] text-zinc-600 sm:flex-row">
          <p>Copyright 2026 - Programming Hero</p>
          <p>Terms &amp; Policy · Privacy Guideline</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;