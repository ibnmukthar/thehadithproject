"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A section that opens and closes, and remembers which the visitor chose.
 * The record stays on the page in full; only the framing collapses. The
 * `hint` is the one line that says why the section matters.
 */
export function Disclosure({
  id,
  title,
  hint,
  defaultOpen = false,
  headingLevel = 2,
  aside,
  children,
}: {
  id: string;
  title: ReactNode;
  hint?: ReactNode;
  defaultOpen?: boolean;
  headingLevel?: 2 | 3;
  aside?: ReactNode;
  children: ReactNode;
}) {
  const key = `thp-open:${id}`;
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === "1" || saved === "0") setOpen(saved === "1");
    } catch {}
  }, [key]);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <details
      ref={ref}
      open={open}
      className="disclosure rule"
      onToggle={(e) => {
        const o = (e.currentTarget as HTMLDetailsElement).open;
        setOpen(o);
        try {
          window.localStorage.setItem(key, o ? "1" : "0");
        } catch {}
      }}
    >
      <summary className="disclosure-summary">
        <span className="disclosure-marker" aria-hidden="true" />
        <span className="disclosure-title">
          <Heading className={headingLevel === 2 ? "text-[1.3rem] sm:text-[1.4rem] leading-tight inline" : "text-[1.1rem] leading-tight inline"}>{title}</Heading>
          {hint && <span className="disclosure-hint small text-ink-2 block mt-0.5">{hint}</span>}
        </span>
        {aside && <span className="disclosure-aside shrink-0">{aside}</span>}
      </summary>
      <div className="disclosure-body">{children}</div>
    </details>
  );
}
