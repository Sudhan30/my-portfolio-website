# Release and rollback checklist — pending after design approval

This checklist carries the later plan gates forward. None of its cloud or publication steps has been authorized or executed by this package.

## Local implementation after approval

- Record design/copy/portrait approval; finish all three work stories in typed collections.
- Replace CRA at the site root with the approved Astro static site, Node 24, exact dependency versions, and committed lockfile. Preserve branch history; do not merge historical telemetry branches.
- Generate metadata, canonicals at `https://sudharsana.dev`, structured data, sitemap, favicon, and local social previews from approved content. Keep `/404.html` genuine rather than a SPA rewrite.
- Remove legacy UI, frontend API calls, tracking, and old dependencies. Removing callers does not retire deployed endpoints.
- Repeat actual frontend, content, backend-boundary, and cybersecurity reviews. Independent review remains a separate requirement; the checks in this package are authored verification, not independent signoff.

## Remote safeguard gate

- Obtain bounded approval to disable **both** existing Firebase Hosting workflows before any redesign push or PR.
- Verify disabled workflow state remotely. Inventory active deployment runs; obtain approval for any cancellations or resolve them within the approved scope.
- Prepare a small safeguards PR with credential-free build/checks and a manual production release. Review and merge only with the corresponding approval.
- Configure protected environment approval and short-lived cloud identity restricted to this repository and release workflow under separately approved cloud scope.
- Keep ordinary checks change-aware and near five minutes. Full browser/performance/security/release validation is an explicit broader mode.

## Build and acceptance evidence

- Full repository/history/artifact secret scanner; triage dependency audit and suspicious findings without printing secret values. A confirmed leak requires rotation/revocation before coordinated cleanup.
- Keyboard and screen-reader review, visible focus, actual 200% browser zoom, reduced motion, touch, and no-JavaScript content. No serious/critical automated findings.
- Chromium, Firefox, and WebKit on representative mobile/tablet/desktop widths, all routes and illustration states, no clipping or horizontal overflow.
- Initial compressed JS ≤100KB, CSS ≤40KB, mobile transfer ≤700KB. Three fixed-condition mobile Lighthouse runs with median performance ≥95; record LCP ≤2.5s and CLS ≤0.1. Field INP remains a later real measurement.
- Confirm no application API, telemetry, analytics, remote embed, form, database, or model calls in the artifact or browser.
- Review images/SVGs and metadata; check font licenses, portrait consent, canonical URLs, sitemap, social images, and all links.

## Hosting and artifact promotion

- Review HTTP CSP using self-hosted assets, required generated hashes, `connect-src 'none'`, blocked framing, and only the necessary Motion style allowance. Review HSTS separately for domain/subdomain readiness.
- Revalidate HTML; cache fingerprinted assets immutably. Verify path-preserving www redirect against actual Hosting/domain capabilities; no guessed domain-wide or subdomain changes.
- Approved preview only: static artifact with no production integrations and `X-Robots-Tag: noindex, nofollow`. Verify real preview headers. Firebase previews otherwise share backend resources.
- Build without deployment credentials, package the exact validated artifact, record SHA-256 and workflow provenance.
- Promotion job verifies artifact checksum and identity before credentials. Do not rebuild or run application scripts once credentials are available. Restrict the approved operation to Hosting.
- Verify redirects, security/cache headers, real 404s, canonical/sitemap/social output, exact artifact identity, and expected live pages after approved promotion.

## Rollback rehearsal and production rollback

- Before release, record the previously serving Hosting release/version and the exact new artifact digest. Preserve the previous artifact.
- Rehearse approved staging promotion and rollback, including headers, routes, and unknown-route 404 behavior; capture version identity before/after.
- Define concrete rollback triggers: broken navigation/critical rendering, wrong artifact or headers, privacy/network regressions, or material accessibility failure.
- Roll back only to the recorded known-good release within an explicitly approved rollback scope. Verify serving version, representative pages, headers, 404, and external-request behavior. Report observed outcomes separately from command exit status.

## Legacy retirement inventory

Static callers below are known from this checkout. External consumers, deployed revisions, triggers, logs, and shared resources are **not inventoried yet**. No retirement approval is implied.

| Function | Known local caller | Further evidence before retirement |
| --- | --- | --- |
| `pageView` | `src/App.js` through `src/utils/env.js` | Deployed callers and `pageViews` counter/resource consumers |
| `submitFeedback` | `Feedback.js`, `FloatingFeedback.js` | `feedbackCollect` consumers, retention requirements |
| `submitContactForm` | `ContactForm.js` | Mail integration, `contactSubmissions` consumers and retention |
| `analyzeJobDescription` | `JobDescriptionAnalyzer.js`; inspect `JobFitEvaluator.jsx` endpoint configuration | `jobAnalyses` consumers and actual endpoint routing |
| `trackTelemetry` | Export in `functions/index.js`; caller not established by this package | External/deployed callers, telemetry/session consumers |
| `processOtelData` | `src/services/opentelemetry.js` via fetch and sendBeacon | Collector/external callers, BigQuery and service identity sharing |
| `processOtelDataBatch` | Export in `functions/index.js`; source handler in `otel-processor.js` | Actual trigger configuration, external writers, downstream consumers |

Inventory consumers and resources, propose the smallest retirement scope, obtain separate approval, then verify actual retirement. Preserve shared APIs, databases, DNS, and credentials outside that scope.
