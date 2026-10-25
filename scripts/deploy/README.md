# Deploying the static export to the Cloudflare Worker without Wrangler

`pnpm deploy` (build + `wrangler deploy`) is the normal path once `npx wrangler login` has been run on the machine. When Wrangler cannot log in, the same upload can be done against the Cloudflare API in four steps, which is how the site was first published:

1. `NODE_ENV=production pnpm build`
2. `node scripts/deploy/manifest.mjs out manifest.json` — hashes every file in `out/` the way Workers Static Assets expects (`sha256(base64(content) + extension)`, first 32 hex characters) and prints the file count and total size.
3. `POST /accounts/<account>/workers/scripts/thehadithproject/assets-upload-session` with `{ "manifest": <manifest.json> }` (an API token with Workers Scripts edit permission, or an OAuth session). The response holds a `jwt` and `buckets`: the hashes Cloudflare does not have yet, grouped for upload. Save it as `session.json`.
4. `node scripts/deploy/upload.mjs out manifest.json session.json <account>` uploads each bucket with the session JWT and prints the completion JWT.
5. `PUT /accounts/<account>/workers/scripts/thehadithproject` as multipart form data with a `metadata` part `{ "main_module": "index.js", "compatibility_date": "...", "assets": { "jwt": "<completion jwt>", "config": { "html_handling": "auto-trailing-slash", "not_found_handling": "404-page", "_headers": "<contents of public/_headers>" } } }` and an empty `index.js` module (the Worker serves assets only).

Limits that matter: 20,000 files per version on the free plan (100,000 on paid), 25 MiB per file. With Sahih al-Bukhari in full the export is under ten thousand files; a second collection of similar size will still fit, a third will not without the paid plan or the move to server rendering described in `docs/plans/phase-2.md`.
