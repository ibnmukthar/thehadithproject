import type { ReactNode } from "react";

const REPO = "https://github.com/ibnmukthar/thehadithproject";

/**
 * "Report a correction" on any line of the record. Opens a prefilled GitHub
 * issue form; the report is public and auditable from the moment it is filed.
 * No portal yet: this is phase A of the contribution model.
 */
export function reportUrl(record: string, line?: string): string {
  const q = new URLSearchParams({ template: "correction.yml", title: `Correction: ${record}`, record });
  if (line) q.set("line", line.slice(0, 1500));
  return `${REPO}/issues/new?${q.toString()}`;
}

export function ReportLink({ record, line, children, className = "" }: { record: string; line?: string; children?: ReactNode; className?: string }) {
  return (
    <a href={reportUrl(record, line)} rel="noopener" className={`report-link tiny text-muted hover:text-ink ${className}`} aria-label={`Report a correction to ${record}`}>
      {children ?? "Report a correction"}
    </a>
  );
}
