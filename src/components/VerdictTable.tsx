import type { ScholarVerdict } from "@/data/types";
import { HadithChip } from "./GradeMark";
import { ReportLink } from "./ReportLink";

export function VerdictTable({ verdicts, showArabic = false, record }: { verdicts: ScholarVerdict[]; showArabic?: boolean; record?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="data stack">
        <thead>
          <tr>
            <th>Scholar</th>
            <th>Verdict</th>
            <th>Where</th>
            <th>Reason given</th>
          </tr>
        </thead>
        <tbody>
          {verdicts.map((v, i) => (
            <tr key={i}>
              <td className="whitespace-nowrap" data-label="Scholar">
                <div className="font-medium text-ink">{v.scholar}</div>
                <div className="tiny text-muted">{typeof v.died === "number" ? `d. ${v.died} AH` : v.died ?? ""}</div>
              </td>
              <td className="min-w-[9rem]" data-label="Verdict">
                <HadithChip band={v.band} label={v.grade} size="sm" />
                {v.scope && <div className="tiny text-muted mt-1">{v.scope}</div>}
              </td>
              <td className="min-w-[10rem]" data-label="Where">{v.url ? <a className="link" href={v.url} rel="noopener">{v.source}</a> : v.source}</td>
              <td className="min-w-[16rem]" data-label="Reason given">
                <div>{v.reason}</div>
                {showArabic && v.quoteAr && (
                  <div lang="ar" dir="rtl" className="arabic text-[1.1rem] text-ink-2 mt-1" style={{ direction: "rtl", textAlign: "right" }}>{v.quoteAr}</div>
                )}
                {record && <div className="mt-1"><ReportLink record={`${record} · verdict of ${v.scholar}`} line={`${v.grade}: ${v.reason}`} /></div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
