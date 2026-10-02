# Local design validation

Checked on 2026-10-02 against the built design package. This is evidence for the initial design review, not production acceptance.

## Completed

| Check | Observed result | Evidence |
| --- | --- | --- |
| Node/dependencies | Node 24.19.0; exact versions and committed lockfile | `.nvmrc`, `package.json`, `package-lock.json` |
| Astro/TypeScript | 0 errors, 0 warnings, 0 hints across 17 files | `npm run check` |
| Static build | Seven routes, including one complete work story, review hub, all three interaction states, and 404 | `npm run build`; `evidence/artifact-checks.json` |
| Browser layout | Chromium 153.0.8010.12 and Firefox 155.0; seven routes at 320, 390, 768, and 1440px; 56 checks without document overflow | `evidence/browser-checks.json` |
| Automated accessibility | 28 axe WCAG A/AA scans across mobile and desktop; zero reported violations | `evidence/browser-checks.json` |
| Interaction | Native radio arrow keys, reduced motion, no idle animation, each deliberate animation stops, rapid changes settle; touch in Chromium | `evidence/browser-checks.json` |
| No JavaScript | Homepage content, story navigation, all explanations, and every initial figure state readable | `evidence/browser-checks.json` |
| Navigation | Work-story/back link, skip link, exact existing LinkedIn destination, and real unknown-route 404 | `evidence/browser-checks.json` |
| Privacy | No external browser requests, cookies, or local/session storage; no application API or tracking references in the built CSS/JS | Browser report and artifact checks |
| Assets | Local fonts/portrait/illustrations; licenses present; WebP variants have no EXIF/XMP/ICC payload; public SVG has no executable/remote content | Artifact validation and `CONTENT-REVIEW.md` |
| Size budgets | gzip JS 3,464 bytes; gzip CSS 3,684 bytes. Fresh mobile context: Chromium 100,068 bytes; Firefox 100,606 bytes, served without response compression | Artifact report; browser report |
| Dependency audit | Zero known vulnerabilities reported by npm audit for the isolated package | `evidence/dependency-audit.json` |
| Zoom simulation | No overflow at 200% CSS zoom in Chromium/Firefox | Browser report; actual browser zoom remains pending |
| Visual inspection | Desktop/mobile homepage and shared-prefix capture inspected; illustrations, composition, and copy hierarchy checked | PNGs in `evidence/`; owner design approval still pending |
| Repository isolation | Original checkout clean on `main`; changes confined to `design-package/` in the separate worktree | Local git status/diff verification |

`evidence/artifact.sha256` records SHA-256 for every emitted file. It identifies this local design build; it is not a release approval or deployment attestation.

The reproducible commands are in [README.md](README.md). Browser runs write current results rather than retaining stale passing evidence. Unavailable browsers are explicit in the report.

## Pending or unavailable

- **WebKit:** browser downloaded, but launch blocked by missing host libraries including GTK4, Graphene, libevent, Opus, and multimedia libraries. No system packages were installed. This gate is not passed.
- Manual screen-reader review and actual browser 200% zoom are pending. Automated axe and CSS zoom do not establish those outcomes.
- Three fixed-condition Lighthouse mobile runs, LCP/CLS measurements, final cross-browser acceptance, and independent frontend/security/content review are pending for the approved full build. No Lighthouse score or field INP claim is made.
- Complete public-repository history and artifact credential scanning is a release requirement. The design package's API/tracking-reference and asset checks do not replace a comprehensive secret scanner.
- Copy, contribution, career, portrait, and design approval are pending.
- Production metadata, two additional work-story routes, Firebase redirects/cache/security headers, workflow safeguards, protected short-lived identity, exact-artifact promotion, staging rollback rehearsal, publication, and deployed endpoint retirement have not been implemented or executed at this review gate.

The local preview applies `X-Robots-Tag: noindex, nofollow`, strict script sources, blocked connections/framing, and no caching. It permits element style attributes for Motion and review swatches. Production headers and artifact promotion must be separately reviewed as described in [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md).
