# Static studio release

The user explicitly instructed: “push the code main, cicd will deploy.” This authorizes the main push and its existing automatic Hosting deployment. It replaces the earlier local-only/manual-release sequence for this release. No new cloud identity, DNS changes, preview channel, endpoint retirement, or shared-resource deletion is included.

## Validated implementation

- Root scripts now build the reviewed Astro application in `design-package/`; CRA is no longer an active dependency or build path.
- Node 24.19.0, exact application versions, standalone app lockfile. Explicit TypeScript includes avoid a resolution problem caused by hoisting the app into a workspace.
- Seven public pages (homepage and six work stories), real 404, canonical URLs, WebPage/Person structured data, sitemap, favicon, and a local 1200×630 social image. The local `/design/` guide and scenario review routes are excluded from the production artifact.
- Hosting config has no SPA rewrite, API backend, function deployment configuration, or application hook. HTML revalidates; fingerprinted assets cache immutably. CSP permits local scripts/assets and generated structured-data hashes, with blocked connections and framing and no unsafe-inline/eval allowances. Motion works under that CSP in the tested browsers.
- PR checks are credential-free and do not publish previews. Main deployment builds and validates first, uploads an artifact, verifies archive and file hashes in a separate job, installs the deployment CLI before credentials, and invokes Hosting-only deployment. No application checkout, rebuild, or application script runs in the deployment job.

## Evidence

Local production type/build/artifact checks pass. Chromium and Firefox each passed 28 layouts and 14 axe scans; no serious/critical findings, external page requests, or CSP failures. Keyboard, reduced motion, deliberate animation, no-JavaScript navigation, and genuine unknown/review-route 404s passed under the production CSP.

Three fixed mobile Lighthouse runs scored **99, 99, 99**, with LCP about **1.80s**, CLS **0.0012**, and transfer **134,998 bytes**. Conditions and exact values are saved in `design-package/evidence/lighthouse-mobile.json`. These are lab observations, not field measurements.

Gitleaks 8.30.1 scanned all refs with full merge history (202 commits), current source-only files, and the deployable artifact with zero findings. The app dependency audit reports zero known vulnerabilities. Findings are summarized without secret values in `design-package/evidence/release-secret-scan.json`.

## Practical limitations

WebKit remains unavailable on this host because of missing system libraries. Manual screen-reader verification, actual browser zoom review, independent external reviews, and a cloud staging rollback rehearsal are not complete. Their status is not inferred from automated checks.

This release reuses the repository's existing Firebase service-account secret, as requested through existing CI/CD. Protected deployment approval and short-lived identity were not newly configured. Those remain separately scoped hardening work.

The existing `www` custom domain currently serves the same site with HTTP 200; the canonical host is `https://sudharsana.dev`. A host-level www redirect needs a separately reviewed domain configuration change; no DNS/domain setting is modified here.

## Rollback

The previous main head was `f8288606d3b918e214ee72b071ea4c7b9fcd3f6c`, with successful deployment workflow run `22054361719`. The previous public index was saved locally before publication. The deployment job records the prior Hosting release version when credentials are available. Rollback means restoring that known Hosting version through the Firebase console or a separately approved Hosting release action, then verifying the serving version and representative paths. It does not mean rebuilding an arbitrary old branch with deployment credentials.

Version 1/2/3 design tags remain preserved. Cloud Functions and their downstream resources remain deployed; frontend removal is not endpoint retirement.
