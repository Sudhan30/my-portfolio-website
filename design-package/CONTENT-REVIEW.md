# Content and asset review

Status: **version 03 local draft**. The user approved the visual direction, requested the résumé expansion, then asked that those materials be used as inspiration for a high-level rewrite. Visitor-facing provenance, résumé references, and review scaffolding have been removed. Source traceability stays in this repository. Publication review remains separate.

| Item | Source or reasoning | Owner decision needed |
| --- | --- | --- |
| “Sudharsana” and full name | Existing portfolio `src/components/Hero.js`, `About.js` | Confirm preferred identity |
| Existing illustrated portrait | `src/myProfPhoto.png`; pixel-only WebP derivative, responsive variants | Approve use and likeness |
| Headline and AI systems/inference focus | Supplied plan; editorial draft in `src/content/site.ts` | Approve final positioning |
| First-person curiosity and biography | Editorial prose, informed by the supplied direction | Confirm it sounds like you and reflects your interests |
| Professional stories, scope figures, and career journey | Supplied August 2026 DE DOCX and uploaded FDE PDF; see `RESUME-CONTENT-REVIEW.md` | Review the final paraphrasing, current-role wording, and public suitability |
| AI chat story | Public architecture article dated 2026-02-05 | Confirm contribution and decision descriptions; approve final copy |
| Text-to-SQL story | Public article dated 2026-03-11 | Review the design account and explicit limits of the illustrated SQL checks |
| freshprobe story | Public README re-read 2026-10-02 | Review project framing and the distinction between freshness signals and factual correctness |
| Education and Google Cloud certification | Both supplied résumés | Review exact degree/certification names and dates |
| Three note dates | Local article frontmatter matching the public source titles | Confirm editorial preview text |
| LinkedIn, GitHub, blog | Existing contact component | Confirm preferred contact destinations |

## Evidence boundaries

Professional work now includes employment, contribution, and outcome statements supported by the supplied résumés. Their source and measurement limits are explicit. No independent employer confirmation, metric audit, deployment verification, or agent-quality benchmark is implied.

The personal stories describe architecture and capabilities without current deployment/performance claims. Visitor pages present the work directly. Exact source mappings and the 95% attribution target distinction are recorded in [RESUME-CONTENT-REVIEW.md](RESUME-CONTENT-REVIEW.md). Provenance fields remain unrendered; no evidence panel or audit language appears on the site.

Public source links:

- [AI chat architecture](https://github.com/Sudhan30/my-blog-site-sudhanverse/blob/main/content/posts/building-ai-chat-system.md)
- [Text-to-SQL agent](https://github.com/Sudhan30/my-blog-site-sudhanverse/blob/main/content/posts/text-to-sql-agent.md)
- [freshprobe](https://github.com/Sudhan30/freshprobe)
- [Two sites, two paths](https://blog.sudharsana.dev/post/two-sites-two-paths)

All three `/post/<slug>` blog destinations returned HTTP 200 in read-only checks on 2026-10-02. Public GitHub links are ordinary navigation; their contents are not embedded or fetched by the site.

## Asset provenance

- Original illustrations: authored SVG geometry in `src/components/WorkArt.astro`, `Workbench.astro`, and the homepage, including the new agents, identity, and affiliate diagrams. SVGs have no remote references, scripts, embedded foreign content, or raster payloads. The certification stamp is a decorative original symbol, not an official credential badge.
- Portrait: existing repository asset. The derivative carries only pixels; generated WebP variants are local. The original remains preserved.
- Space Grotesk 400/600 and Instrument Serif 400 italic: pinned Fontsource packages, Latin WOFF2, bundled locally. OFL licenses copied to `public/licenses/` and emitted into the artifact. No remote font provider is called.
- Conceptual inference copy: describes prefill/decode, waiting vs batch utilization, and cached exact-prefix computation. It uses no simulated benchmark values or timing claims.

## Approval record

Version 01 visual direction: positively reviewed by the user (“website looks great”). Saved before expansion under tag `design-v1-before-resume-expansion` and verified source/preview archives.

Version 02 résumé expansion: requested and implemented locally. Final expanded design/copy review: pending.

Version 03 editorial rewrite: the user said “site looks good” and requested high-level copy using the source materials as inspiration. This rewrite is implemented locally; it does not imply publication authorization.

Copy, career, portrait, contribution approval: pending.

No publication, workflow, cloud, or endpoint-retirement authorization has been inferred from this review. Do not change approval statuses merely because checks pass.

Release authorization update: the user subsequently instructed “push the code main, cicd will deploy.” Main publication through existing Hosting CI/CD is now explicitly authorized. The high-level copy and design are the reviewed version 03. Endpoint retirement, new cloud identity, and domain configuration remain outside that release scope. See the root `RELEASE.md` for actual evidence and limitations.
