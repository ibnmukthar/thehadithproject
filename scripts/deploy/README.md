# Deploying the static export to the Cloudflare Worker without Wrangler

`pnpm deploy` (build + `wrangler deploy`) is the normal path once `npx wrangler login` has been run on the machine. When Wrangler cannot log in, the same upload can be done against the Cloudflare API in four steps, which is how the site was first published:

1. `NODE_ENV=production pnpm build`
2. `node scripts/deploy/manifest.mjs out manifest.json` — hashes every file in `out/` the way Workers Static Assets expects (`sha256(base64(content) + extension)`, first 32 hex characters) and prints the file count and total size.
3. `POST /accounts/<account>/workers/scripts/thehadithproject/assets-upload-session` with `{ "manifest": <manifest.json> }` (an API token with Workers Scripts edit permission, or an OAuth session). The response holds a `jwt` and `buckets`: the hashes Cloudflare does not have yet, grouped for upload. Save it as `session.json`.
4. `node scripts/deploy/upload.mjs out manifest.json session.json <account>` uploads each bucket with the session JWT and prints the completion JWT.
5. `PUT /accounts/<account>/workers/scripts/thehadithproject` as multipart form data with a `metadata` part `{ "main_module": "index.js", "compatibility_date": "...", "assets": { "jwt": "<completion jwt>", "config": { "html_handling": "auto-trailing-slash", "not_found_handling": "404-page", "_headers": "<contents of public/_headers>" } } }` and an empty `index.js` module (the Worker serves assets only).

Limits that matter: 20,000 files per version on the free plan (100,000 on paid), 25 MiB per file. With Sahih al-Bukhari in full the export is under ten thousand files; a second collection of similar size will still fit, a third will not without the paid plan or the move to server rendering described in `docs/plans/phase-2.md`.

## Getting a 1.4 MB manifest to the API without a token or Wrangler

The 25 October 2026 deployment (15,809 files, 605 MB) used the OAuth connection of the Cloudflare MCP connector, whose `execute` tool runs code with `cloudflare.request()` but cannot read local files or fetch external URLs, and cannot sensibly carry a megabyte of manifest inline. The workaround, which can be repeated:

1. Create a KV namespace and a tiny Worker (`thp-deploy-bridge`) with that namespace bound as `KV`, whose `fetch` stores a `PUT` body under the request path and returns it on `GET`, gated by a random secret in the query string; enable its workers.dev subdomain.
2. From the laptop, `curl -X PUT --data-binary @manifest.json "https://thp-deploy-bridge.<subdomain>.workers.dev/manifest?k=<secret>"`.
3. In `execute`: read the manifest back from KV (`GET /storage/kv/namespaces/<ns>/values/manifest`), `POST …/assets-upload-session` with it, and store the `{ jwt, buckets }` response in KV under `session`.
4. From the laptop, `curl` the session from the bridge into `session.json` and run `node scripts/deploy/upload.mjs out manifest.json session.json <account>`; it prints the completion JWT.
5. In `execute`: `PUT` the script with `assets.jwt` set to the completion JWT (one use only: if it is consumed, open a new upload session with the same manifest; with every file already present it returns an empty bucket list and a fresh completion JWT), `bindings: [{ type: "assets", name: "ASSETS" }]`, and a one-line `index.js` that returns `env.ASSETS.fetch(request)` so unknown paths get the 404 page.
6. Delete the bridge Worker and the namespace.

Connecting the repository to Workers Builds makes all of this unnecessary.
