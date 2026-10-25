import Link from "next/link";
import { Wordmark } from "./Wordmark";

const links = [
  { href: "/science/", label: "The science", short: "Science" },
  { href: "/explore/", label: "Explore" },
  { href: "/about/", label: "About" },
  { href: "/contribute/", label: "Contribute" },
];

export function SiteNav() {
  return (
    <header className="border-b border-hairline bg-page/90 backdrop-blur sticky top-0 z-40">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-page focus:px-3 focus:py-1">
        Skip to content
      </a>
      <div className="container flex items-center justify-between gap-4 h-14">
        <Link href="/" aria-label="The Hadith Project home" className="flex items-center gap-2 shrink-0 whitespace-nowrap">
          <Wordmark compact />
        </Link>
        <nav aria-label="Primary" className="sans text-[0.88rem] sm:text-[0.92rem] min-w-0 overflow-x-auto">
          <ul className="flex items-center gap-4 sm:gap-7 whitespace-nowrap">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-2 hover:text-ink transition-colors">
                  {"short" in l && l.short ? (
                    <>
                      <span className="sm:hidden">{l.short}</span>
                      <span className="hidden sm:inline">{l.label}</span>
                    </>
                  ) : (
                    l.label
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
