# Local design validation

Checked on 2026-10-02 against version 03, following the high-level editorial rewrite. This is local review evidence, not production acceptance. Earlier versions and evidence remain preserved in their Git tags; version 01 also has a verified snapshot.

## Completed

| Check | Observed result | Evidence |
| --- | --- | --- |
| Node/dependencies | Node 24.19.0; exact versions and committed lockfile | `.nvmrc`, `package.json`, `package-lock.json` |
| Astro/TypeScript | 0 errors, 0 warnings, 0 hints across 19 files | `npm run check` |
| Static build | Twelve routes, including six work stories, review hub, all three interaction states, and 404 | `npm run build`; `evidence/artifact-checks.json` |
| Browser layout | Chromium 153.0.8010.12 and Firefox 155.0; twelve routes at 320, 390, 768, and 1440px; 96 checks without document overflow | `evidence/browser-checks.json` |
| Automated accessibility | 48 axe WCAG A/AA scans across mobile and desktop; zero reported violations | `evidence/browser-checks.json` |
| Interaction | Native radio arrow keys, reduced motion, no idle animation, each deliberate animation stops, rapid changes settle; touch in Chromium | `evidence/browser-checks.json` |
| No JavaScript | Homepage content, story navigation, all explanations, and every initial figure state readable | `evidence/browser-checks.json` |
| Navigation/content | All six work-story/back links, four career chapters, certification, scoped GMV labels, skip link, exact existing LinkedIn destination, and real unknown-route 404 | `evidence/browser-checks.json` |
| Privacy | No external browser requests, cookies, or local/session storage; no application API or tracking references in the built CSS/JS | Browser report and artifact checks |
| Assets | Local fonts/portrait/illustrations; licenses present; WebP variants have no EXIF/XMP/ICC payload; public SVG has no executable/remote content | Artifact validation and `CONTENT-REVIEW.md` |
| Size budgets | gzip JS 3,464 bytes; gzip CSS approximately 5.2KB. Fresh mobile transfer remains below 700KB | Exact current values in artifact and browser reports |
| Dependency audit | Zero known vulnerabilities reported by npm audit for the isolated package | `evidence/dependency-audit.json` |
| Zoom simulation | No overflow at 200% CSS zoom in Chromium/Firefox | Browser report; actual browser zoom remains pending |
| Visual inspection | Expanded desktop homepage, professional mobile section, and career desktop inspected; six illustrations and content hierarchy checked | PNGs in `evidence/`; final expanded-copy review pending |
| Résumé handling | Both original documents read directly, fingerprints recorded, raw files kept outside source/artifact; no email, phone, local path, or résumé download in emitted pages | `evidence/resume-source-fingerprints.json`, artifact validation, `RESUME-CONTENT-REVIEW.md` |
| Editorial copy | All twelve rendered routes checked for résumé references, audit panels, draft labels, and preview/review language; none present | Artifact validation; source provenance retained in repository notes |
| Repository isolation | Original checkout clean on `main`; changes confined to `design-package/` in the separate worktree | Local git status/diff verification |

`evidence/artifact.sha256` records SHA-256 for every emitted file. It identifies this local design build; it is not a release approval or deployment attestation.

The reproducible commands are in [README.md](README.md). Browser runs write current results rather than retaining stale passing evidence. Unavailable browsers are explicit in the report.

## Pending or unavailable

- **WebKit:** browser downloaded, but launch blocked by missing host libraries including GTK4, Graphene, libevent, Opus, and multimedia libraries. No system packages were installed. This gate is not passed.
- Manual screen-reader review and actual browser 200% zoom are pending. Automated axe and CSS zoom do not establish those outcomes.
- Three fixed-condition Lighthouse mobile runs, LCP/CLS measurements, final cross-browser acceptance, and independent frontend/security/content review are pending for the approved full build. No Lighthouse score or field INP claim is made.
- Complete public-repository history and artifact credential scanning is a release requirement. The design package's API/tracking-reference and asset checks do not replace a comprehensive secret scanner.
- Copy, contribution, career, portrait, and design approval are pending.
- Production metadata, Firebase redirects/cache/security headers, workflow safeguards, protected short-lived identity, exact-artifact promotion, staging rollback rehearsal, publication, and deployed endpoint retirement have not been implemented or executed for this local preview.

The local preview applies `X-Robots-Tag: noindex, nofollow`, strict script sources, blocked connections/framing, and no caching. It permits element style attributes for Motion and review swatches. Production headers and artifact promotion must be separately reviewed as described in [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md).
