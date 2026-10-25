// Usage: node upload.mjs <assetsDir> <manifest.json> <session.json> <accountId>
// session.json = { jwt, buckets } from the assets-upload-session call, where each
// bucket is either a list of hashes or a list of indexes into the manifest's
// paths sorted by name (the compact form used when the session is created
// through a tool that cannot return a large hash list).
import { readFileSync } from "node:fs";
import { join, extname } from "node:path";
const [dir, manifestPath, sessionPath, accountId] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const { jwt, buckets } = JSON.parse(readFileSync(sessionPath, "utf8"));
const paths = Object.keys(manifest).sort();
const byHash = {};
for (const [p, m] of Object.entries(manifest)) byHash[m.hash] = p;
const MIME = { html: "text/html; charset=utf-8", js: "application/javascript", css: "text/css", json: "application/json; charset=utf-8", txt: "text/plain; charset=utf-8", png: "image/png", svg: "image/svg+xml", woff2: "font/woff2", woff: "font/woff", ico: "image/x-icon", map: "application/json", webp: "image/webp", jpg: "image/jpeg", xml: "application/xml" };
function mime(p) { if (p.endsWith("/opengraph-image")) return "image/png"; return MIME[extname(p).slice(1)] || "application/octet-stream"; }
function toHash(x) { return typeof x === "number" ? manifest[paths[x]].hash : x; }
let completion = null;
const total = buckets.reduce((a, b) => a + b.length, 0);
let done = 0;
for (let i = 0; i < buckets.length; i++) {
  const hashes = buckets[i].map(toHash);
  const boundary = "----thp" + Date.now() + i;
  const parts = [];
  for (const h of hashes) {
    const p = byHash[h]; if (!p) throw new Error("no path for " + h);
    const b64 = readFileSync(join(dir, p)).toString("base64");
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="${h}"\r\nContent-Type: ${mime(p)}\r\n\r\n${b64}\r\n`);
  }
  const body = parts.join("") + `--${boundary}--\r\n`;
  let json, res;
  for (let attempt = 1; attempt <= 3; attempt++) {
    res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/assets/upload?base64=true`, {
      method: "POST", headers: { Authorization: `Bearer ${jwt}`, "Content-Type": `multipart/form-data; boundary=${boundary}` }, body,
    });
    json = await res.json().catch(() => ({}));
    if (res.ok && json.success) break;
    console.error(`bucket ${i + 1}: attempt ${attempt} failed ${res.status} ${JSON.stringify(json.errors)}`);
    await new Promise((r) => setTimeout(r, 2000 * attempt));
  }
  if (!res.ok || !json.success) throw new Error(`bucket ${i}: ${res.status} ${JSON.stringify(json.errors)}`);
  done += hashes.length;
  console.error(`bucket ${i + 1}/${buckets.length} uploaded (${hashes.length} files, ${(body.length / 1048576).toFixed(1)} MB) · ${done}/${total}`);
  if (json.result?.jwt) completion = json.result.jwt;
}
if (!completion) throw new Error("no completion jwt");
process.stdout.write(completion);
