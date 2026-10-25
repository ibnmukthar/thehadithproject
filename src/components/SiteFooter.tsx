import Link from "next/link";
import { Wordmark } from "./Wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline mt-20">
      <div className="container py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="small text-ink-2 mt-3 max-w-[36ch]">
            Open infrastructure for hadith and its sciences. Built in public, reviewed by scholars, free to use and build on.
          </p>
          <p lang="ar" dir="rtl" className="arabic text-ink-2 mt-3 text-lg">مَن كذب عليَّ متعمدًا فليتبوأ مقعده من النار</p>
          <p className="tiny text-muted">Sahih al-Bukhari 110, Sahih Muslim 3 (introduction). The warning that started the science.</p>
        </div>
        <FooterCol
          title="Read"
          items={[
            ["/science/", "Why hadith is a science"],
            ["/studies/", "Studied hadith"],
            ["/explore/", "Explore"],
            ["/verify/", "Verify a quote"],
          ]}
        />
        <FooterCol
          title="Project"
          items={[
            ["/about/", "Mission, goals, principles"],
            ["/blueprint/", "The blueprint"],
            ["/contribute/", "Contribute"],
            ["mailto:hello@thehadithproject.com", "Write to us"],
          ]}
        />
        <FooterCol
          title="Open"
          items={[
            ["https://github.com/ibnmukthar/thehadithproject", "Source and data on GitHub"],
            ["/api/v0/hadith.json", "API index"],
            ["/blueprint/#licensing", "Licences"],
          ]}
        />
      </div>
      <div className="container pb-10 tiny text-muted">
        Nothing on this site is a verdict of ours. Every grade shown is attributed to the scholar who gave it, with the source. Machine-parsed chains are labelled as such until a person has checked them. Every line has a link to report a correction.
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
            {href.startsWith("http") || href.startsWith("mailto:") ? (
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
