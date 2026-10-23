import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "The Hadith Project: hadith is a science of provenance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400&display=swap", {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const url = css.match(/src: url\(([^)]+)\) format\('(?:woff|truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await loadFont();
  const nodes = [
    { label: "The Prophet ﷺ", kind: "prophet" },
    { label: "Umar ibn al-Khattab", kind: "sahabi" },
    { label: "Alqama ibn Waqqas", kind: "thiqa" },
    { label: "Muhammad ibn Ibrahim", kind: "thiqa" },
    { label: "Yahya ibn Sa'id", kind: "thiqa" },
    { label: "Sufyan ibn Uyaynah", kind: "thiqa" },
    { label: "al-Humaydi", kind: "thiqa" },
    { label: "al-Bukhari", kind: "thiqa" },
  ];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", color: "#0f1730", fontFamily: font ? "Newsreader" : "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 56px 72px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "#b8891f" }} />
              <div style={{ width: 2, height: 8, background: "#0f1730" }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, border: "2px solid #2240b0" }} />
              <div style={{ width: 2, height: 8, background: "#0f1730" }} />
              <div style={{ width: 12, height: 12, borderRadius: 6, background: "#2240b0" }} />
            </div>
            <div>The Hadith Project</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 78, lineHeight: 1.02, letterSpacing: -1.5 }}>Hadith is a science of provenance.</div>
            <div style={{ fontSize: 26, lineHeight: 1.4, color: "#4a5270", marginTop: 28, width: 640 }}>
              Every narration, every narrator, every verdict with its reason. Open, linked, and checkable in seconds.
            </div>
          </div>
          <div style={{ fontSize: 22, color: "#7b829a" }}>thehadithproject.com</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: 40, gap: 0 }}>
          {nodes.map((n, i) => (
            <div key={n.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    background: n.kind === "prophet" ? "#b8891f" : n.kind === "thiqa" ? "#1b7f3b" : "#ffffff",
                    border: n.kind === "sahabi" ? "3px solid #2240b0" : "none",
                  }}
                />
                <div style={{ fontSize: 22, color: "#0f1730" }}>{n.label}</div>
              </div>
              {i < nodes.length - 1 && <div style={{ width: 2, height: 30, background: "#7b829a", marginLeft: 10 }} />}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Newsreader", data: font, style: "normal", weight: 400 }] : undefined },
  );
}
