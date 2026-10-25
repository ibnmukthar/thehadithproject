import type { Band, RouteComparison } from "@/data/types";
import { BANDS, HADITH_BANDS } from "@/lib/bands";
import { Glyph, HadithChip } from "./GradeMark";

interface TreeNode {
  name: string;
  band?: Band | "gap";
  flag?: string;
  children: TreeNode[];
  leaves: { label: string; verdict: string; band: keyof typeof HADITH_BANDS }[]; // routes ending here
}

/**
 * The corroboration tree (i'tibar): every route of one report merged into a
 * single tree from the Prophet ﷺ downward. Where routes share a narrator they
 * share a node; where a node has several children the routes diverge below
 * it, and that narrator is the pivot (madar) the critics look at. Drawn as a
 * nested list with connector lines, so it reads in order for everyone.
 */
export function CorroborationTree({ comparison }: { comparison: RouteComparison }) {
  const root: TreeNode = { name: "The Prophet ﷺ", band: "prophet", children: [], leaves: [] };
  for (const r of comparison.routes) {
    let cur = root;
    for (const n of r.nodes) {
      let child = cur.children.find((c) => c.name === n.name);
      if (!child) {
        child = { name: n.name, band: n.band, flag: n.flag, children: [], leaves: [] };
        cur.children.push(child);
      }
      cur = child;
    }
    cur.leaves.push({ label: r.label, verdict: r.verdict, band: r.band });
  }
  const pivots: string[] = [];
  const walk = (n: TreeNode) => {
    if (n.children.length >= 2 && n.band !== "prophet") pivots.push(n.name);
    n.children.forEach(walk);
  };
  walk(root);
  return (
    <div className="tree">
      <Node node={root} depth={0} pivots={pivots} />
      <p className="tiny text-muted mt-3">
        Routes that share a narrator share a node. {pivots.length > 0 ? <>Where the tree branches below a narrator ({pivots.join(", ")}), the routes are not independent above that point: they all rest on that one person.</> : "These routes meet only at the Prophet ﷺ, so each stands on its own narrators."}
      </p>
    </div>
  );
}

function Node({ node, depth, pivots }: { node: TreeNode; depth: number; pivots: string[] }) {
  const gap = node.band === "gap";
  const b = node.band && node.band !== "gap" ? BANDS[node.band] : null;
  const pivot = pivots.includes(node.name);
  return (
    <div className={depth === 0 ? "" : "tree-branch"}>
      <div className="tree-node small">
        {gap ? <Glyph glyph="dotted" color="var(--g-daif)" size={13} title="Missing link" /> : b ? <Glyph glyph={b.glyph} color={b.color} size={13} title={b.label} /> : <Glyph glyph="dotted" color="var(--g-unknown)" size={13} title="Not graded here" />}
        <span className={node.flag ? "font-semibold text-ink underline decoration-daif decoration-2 underline-offset-4" : gap ? "italic text-daif" : "text-ink"}>{node.name}</span>
        {pivot && <span className="tiny rounded-full border border-lapis text-lapis px-1.5">pivot</span>}
        {node.flag && <span className="tiny text-daif">{node.flag}</span>}
        {node.leaves.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5 tiny text-ink-2">
            → {l.label} <HadithChip band={l.band} label={l.verdict} size="sm" />
          </span>
        ))}
      </div>
      {node.children.length > 0 && (
        <div className="tree-children">
          {node.children.map((c) => <Node key={c.name} node={c} depth={depth + 1} pivots={pivots} />)}
        </div>
      )}
    </div>
  );
}
