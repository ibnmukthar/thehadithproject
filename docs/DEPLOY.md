# Deploying

**Current state (23 October 2026):** the site is live at https://thehadithproject.com and https://www.thehadithproject.com, served by the Cloudflare Worker `thehadithproject` (account "Muhammad.cetor@gmail.com's Account", zone `thehadithproject.com`) with static assets uploaded through the Cloudflare API. The two custom domains are attached to the Worker; the zone's MX and SPF records for email forwarding were left untouched. A preview also exists at https://thehadithproject.muhammad-cetor.workers.dev. To redeploy after a change: `npx wrangler login` once, then `NODE_ENV=production pnpm deploy`.

The site is a fully static export (`next.config.ts` sets `output: "export"`), so it can be served from any static host. The recommended target is Cloudflare, because the domain can live on Cloudflare DNS, static requests are free and served from the edge, `public/_headers` sets content types for the JSON API and the OpenGraph image, and the later phases of the project (a real API, the reply bot, dataset downloads) fit Workers, D1 and R2 without moving.

## Option 1 (recommended): Cloudflare Workers with static assets, connected to GitHub

Cloudflare now points new projects at Workers with static assets rather than Pages; Pages still works and is listed as option 2.

1. In the Cloudflare dashboard, go to Workers & Pages → Create → Workers → Import a repository, and pick `ibnmukthar/thehadithproject`.
2. Build settings:
   - Build command: `pnpm build`
   - Deploy command: `npx wrangler deploy`
   - Node version is pinned by `.node-version` (22).
   - Set the variable `NODE_ENV=production` (Cloudflare's build image may set a different value).
3. The repo already contains `wrangler.jsonc`, which tells Wrangler to upload the `out/` folder, redirect `/path` to `/path/` (matching Next's `trailingSlash: true`), and serve `404.html` for unknown paths.
4. Custom domain: in the Worker's settings add `thehadithproject.com` and `www.thehadithproject.com`. If the domain's DNS is on Cloudflare, the records are created for you.
5. Every push to `main` deploys; every pull request gets a preview URL.

To deploy from a laptop instead: `pnpm build && npx wrangler deploy` after `npx wrangler login`.

## Option 2: Cloudflare Pages

Workers & Pages → Create → Pages → Connect to Git. Framework preset: none. Build command `pnpm build`, build output directory `out`, environment variable `NODE_VERSION=22` and `NODE_ENV=production`. `public/_headers` is honoured. Add the custom domain under the project's Custom domains tab.

## Option 3: Vercel

Import the repository; Vercel detects Next.js. Because the project is a static export, it is served as static files. Set `NODE_ENV` only if your account overrides it. Vercel does not read `_headers`; the content types for `/opengraph-image` and `/api/*.json` are inferred from the files and work without it.

## Option 4: GitHub Pages

Works for the HTML, but there is no way to set the `Content-Type` of the extensionless `/opengraph-image` file, so the link-preview card may not render on some platforms. Not recommended for launch.

## After deploying

- Open `https://thehadithproject.com/api/v0/hadith.json` and check the content type is JSON.
- Paste `https://thehadithproject.com/h/actions-by-intentions/` into a card validator (for example opengraph.xyz) and check the image renders.
- Turn on Cloudflare Web Analytics (no cookies, no consent banner needed) if you want traffic numbers.
