# Mixed Chicago Landing Page

GitHub Pages: this repo auto-deploys on push to main. Keep CNAME = mixedchicago.com.

Custom domain: In repo → Settings → Pages → Custom domain = mixedchicago.com. Set DNS CNAME on your registrar to point to blindldev.github.io.

## Cloudflare Worker (Free Plan):

1. Dashboard → Workers & Pages → Create Worker → name mixedmediums-subscribe.
2. Paste worker.js into the editor, Save & Deploy.
3. KV → Create Namespace MM_SUBSCRIBERS.
4. Worker → Settings → Variables & Bindings → KV Namespace → Bind name MM_SUBSCRIBERS to that namespace.
5. Copy the Worker URL https://<your-worker-subdomain>.workers.dev.
6. In index.html, set ENDPOINT to that URL.

Optional security: enable Bot Fight Mode; add Turnstile later if needed.

CORS: In worker.js, the domain mixedchicago.com is already configured for CORS.

## Smoke test:

1. Open https://mixedchicago.com. Submit a test email.
2. In Cloudflare → KV → MM_SUBSCRIBERS → confirm the key exists.
3. Export emails: In Cloudflare KV, click List → Download JSON. You can import to Sheets or your CRM.

## What you (the human) need to replace, just once

1. In index.html: set ENDPOINT to the Worker URL (e.g., https://mixedmediums-subscribe.<subdomain>.workers.dev).
2. In worker.js: CORS is already configured for mixedchicago.com.
3. In GitHub Pages settings: set Custom domain to mixedchicago.com, and point your DNS CNAME to blindldev.github.io.

## Notes on the free limits

- Cloudflare Workers (Free): plenty for a simple form; KV also has a free tier suitable for < 1,000 emails and low write/read volume.
- GitHub Pages: free for public repos; perfect for this static landing.

## Optional hardening (quick)

- Add a simple per-email cooldown (e.g., store a lastTs and reject if < 60s since last write).
- Add Turnstile (free) for CAPTCHA: easy to drop into the form and verify in the Worker.
- Add X-Content-Type-Options: nosniff and Referrer-Policy headers in the Worker if you want extra neatness.
