import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Blueprint",
  description: "How to take the integrity of hadith into the digital age: identifiers, the graph, narrator criticism, verdicts, provenance, governance and the roadmap.",
};

export default function BlueprintPage() {
  const md = readFileSync(join(process.cwd(), "docs", "BLUEPRINT.md"), "utf8");
  return (
    <div className="container pt-10 pb-16">
      <article className="prose">
        <Markdown remarkPlugins={[remarkGfm]}>{md}</Markdown>
      </article>
    </div>
  );
}
