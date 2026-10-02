# Content and asset review

Status: **draft; owner approval pending**. No factual review or design approval has been inferred from the instruction to implement the plan.

| Item | Source or reasoning | Owner decision needed |
| --- | --- | --- |
| “Sudharsana” and full name | Existing portfolio `src/components/Hero.js`, `About.js` | Confirm preferred identity |
| Existing illustrated portrait | `src/myProfPhoto.png`; pixel-only WebP derivative, responsive variants | Approve use and likeness |
| Headline and AI systems/inference focus | Supplied plan; editorial draft in `src/content/site.ts` | Approve final positioning |
| First-person curiosity and biography | Editorial prose, informed by the supplied direction | Confirm it sounds like you and reflects your interests |
| Career paragraph | Older portfolio `src/data.js`; no current title, dates, impact metrics, or employment assertion | Confirm roles and whether employers should appear |
| AI chat story | Public architecture article dated 2026-02-05 | Confirm contribution and decision descriptions; approve final copy |
| Text-to-SQL preview | Public article dated 2026-03-11 | Confirm contribution before completing the full story |
| freshprobe preview | Public README inspected 2026-10-02 | Confirm project framing and contribution before completing the full story |
| Three note dates | Local article frontmatter matching the public source titles | Confirm editorial preview text |
| LinkedIn, GitHub, blog | Existing contact component | Confirm preferred contact destinations |

## Evidence boundaries

Work copy describes documented architecture and capabilities. It makes no latency, accuracy, cost, deployment, current production-readiness, revenue, or employment claims. The complete story makes its evidence boundary explicit. First-person authorship still requires owner confirmation.

Public source links:

- [AI chat architecture](https://github.com/Sudhan30/my-blog-site-sudhanverse/blob/main/content/posts/building-ai-chat-system.md)
- [Text-to-SQL agent](https://github.com/Sudhan30/my-blog-site-sudhanverse/blob/main/content/posts/text-to-sql-agent.md)
- [freshprobe](https://github.com/Sudhan30/freshprobe)
- [Two sites, two paths](https://blog.sudharsana.dev/post/two-sites-two-paths)

All three `/post/<slug>` blog destinations returned HTTP 200 in read-only checks on 2026-10-02. Public GitHub links are ordinary navigation; their contents are not embedded or fetched by the site.

## Asset provenance

- Original illustrations: authored SVG geometry in `src/components/WorkArt.astro`, `Workbench.astro`, and the homepage. SVGs have no remote references, scripts, embedded foreign content, or raster payloads.
- Portrait: existing repository asset. The derivative carries only pixels; generated WebP variants are local. The original remains preserved.
- Space Grotesk 400/600 and Instrument Serif 400 italic: pinned Fontsource packages, Latin WOFF2, bundled locally. OFL licenses copied to `public/licenses/` and emitted into the artifact. No remote font provider is called.
- Conceptual inference copy: describes prefill/decode, waiting vs batch utilization, and cached exact-prefix computation. It uses no simulated benchmark values or timing claims.

## Approval record

Design approval: pending.

Copy, career, portrait, contribution approval: pending.

Record the actual approving instruction and any edits here after review. Do not change these statuses merely because checks pass.
