import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline mt-24">
      <div className="container py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="small text-ink-2 mt-3 max-w-[36ch]">
            Open infrastructure for hadith and its sciences. Built in public, reviewed by scholars, free to use and build on.
          </p>
          <p className="arabic text-ink-2 mt-3 text-lg">مَن كذب عليَّ متعمدًا فليتبوأ مقعده من النار</p>
          <p className="tiny text-muted">Sahih al-Bukhari 110, Sahih Muslim 3 (introduction). The warning that started the science.</p>
        </div>
        <FooterCol
          title="Project"
          items={[
            ["/science/", "Why hadith is a science"],
            ["/explore/", "Explore the demo"],
            ["/blueprint/", "The blueprint"],
            ["/contribute/", "Contribute"],
          ]}
        />
        <FooterCol
          title="Demo hadith"
          items={[
            ["/h/actions-by-intentions/", "Actions are by intentions"],
            ["/h/leaving-what-does-not-concern/", "Leaving what does not concern you"],
            ["/h/seek-knowledge-even-in-china/", "Seek knowledge even in China"],
          ]}
        />
        <FooterCol
          title="Open"
          items={[
            ["https://github.com/ibnmukthar/thehadithproject", "Source on GitHub"],
            ["/api/v0/hadith/actions-by-intentions.json", "Example API response"],
            ["/blueprint/#licensing", "Data licence"],
          ]}
        />
      </div>
      <div className="container pb-10 tiny text-muted">
        Nothing on this site is a verdict of ours. Every grade shown is attributed to the scholar who gave it, with the source. Demo data is hand-checked but still a prototype; corrections welcome.
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="sans text-[0.9rem]">
      <div className="font-semibold text-ink mb-3">{title}</div>
      <ul className="space-y-2">
        {items.map(([href, label]) => (
          <li key={href}>
            {href.startsWith("http") ? (
              <a href={href} className="text-ink-2 hover:text-ink" rel="noopener">{label}</a>
            ) : (
              <Link href={href} className="text-ink-2 hover:text-ink">{label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
