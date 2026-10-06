# Sudharsana local design package

This is version 03 of the runnable local design. At the user's request, résumé material now informs direct, high-level editorial copy about the work, rather than appearing as attribution or review language in the visitor experience. It lives on `redesign/design-package`, in an isolated worktree created from `main` at `f8288606d3b918e214ee72b071ea4c7b9fcd3f6c`. No remote push, PR, workflow change, deployment, or cloud retirement has occurred.

Version 01 is preserved at commit `7feebbd2485d5d4738f52edf76c19bff7ce771e3`, local tag `design-v1-before-resume-expansion`, and `/home/sudhan0312/Desktop/sudharsana-design-snapshots/2026-10-02-design-v1/`. Its source and exact built-preview archives were checksum verified before these changes.

Version 02 is preserved at commit `de6a74a` and tag `design-v2-resume-expansion`.

## Open the package

With Node 24 (pinned development runtime: 24.19.0):

```sh
cd /home/sudhan0312/Desktop/my-portfolio-design/design-package
npm ci --ignore-scripts
npm run check
npm run build
npm run validate
npm run preview
```

If Node is unavailable in this shell, the verified existing runtime can be added for this shell only:

```sh
export PATH=/home/sudhan0312/actions-runner/externals/node24/bin:$PATH
```

Open **http://127.0.0.1:4321/** for the site and `/design/` for the studio palette/type/interaction guide. The preview server listens only on loopback. It serves built files with blocked connections, no indexing, and a real 404 response. Its `style-src-attr 'unsafe-inline'` allowance supports the studio swatches and Motion's element transforms; it is not the final production CSP.

## Review artifacts

- Homepage: `/`; [desktop](evidence/homepage-desktop.png) and [mobile](evidence/homepage-mobile.png).
- Professional work stories: `/work/gtm-agents/`, `/work/customer-identity/`, `/work/affiliate-pipeline/`; [professional section desktop](evidence/professional-section-desktop.png) and [mobile](evidence/professional-section-mobile.png), [GTM story desktop](evidence/professional-story-desktop.png) and [mobile](evidence/professional-story-mobile.png).
- Personal work stories: `/work/ai-chat/`, `/work/data-platform/`, `/work/argus/`, `/work/freshprobe/` (the old `/work/text-to-sql/` redirects to the chat story in production); [AI chat story desktop](evidence/work-story-desktop.png) and [mobile](evidence/work-story-mobile.png).
- Career, education, and certification: `/#experience`; [desktop](evidence/career-desktop.png) and [mobile](evidence/career-mobile.png).
- Typography, palette, and review questions: `/design/`; [desktop](evidence/design-system-desktop.png) and [mobile](evidence/design-system-mobile.png).
- Inference states: `/design/states/one/`, `/design/states/queue/`, `/design/states/prefix/`; [one request](evidence/inference-one.png), [busy queue](evidence/inference-queue.png), [shared prefix](evidence/inference-prefix.png).
- [Content review](CONTENT-REVIEW.md), [validation evidence](VALIDATION.md), and [release/rollback checklist](RELEASE-CHECKLIST.md).

The workbench has no startup animation. Each deliberate selection plays a short animation once. Reduced motion changes the state immediately. Native radios support keyboard and touch; without JavaScript, CSS updates the figure and all explanations remain visible. Motion is locally bundled through its small animation entrypoint. Portrait variants, fonts, CSS, and scripts are local assets. All seven story links are local document navigation.

Every story opens with a playable figure (`src/components/figures/`, runtime in `src/scripts/figures/stage.ts`). It reuses the workbench chips and explanation panels inside the story frame, plays its opening scenario once when it scrolls into view, and settles. Reduced motion jumps straight to each settled state. Without JavaScript the first scenario is drawn and every explanation is readable. Homepage illustrations play a one-shot arrival when their card enters the view and on hover (`src/scripts/art-preview.ts`); the CSS skips it under reduced motion. `scripts/playable-checks.mjs` covers all of this in both browser checks. Set `DESIGN_URL` to run the design browser check against a preview on another port. Professional work, personal work, and career chapters use typed content collections.

The visual treatment includes a featured professional story, illustrated project cards, contextual scope figures, connected career chapters, and an original certification stamp. Hover details respect reduced motion. Raw résumés, personal phone/email, and internal documents are not copied into the source or artifact. Scope labels remain precise (order GMV surfaced, first-year visits/GMV, distinct organizations), while source provenance and review requirements remain in repository documentation and unrendered collection fields. Public project links remain ordinary optional links for a deeper read.

## Reproduce browser checks

Keep the preview server running in a separate terminal:

```sh
npx playwright install chromium firefox webkit
npm run test:browser
```

The script saves structured results and screenshots in `evidence/`. Unavailable browsers are recorded explicitly. It fails on actual layout, behavior, or serious/critical accessibility failures, and requires at least one completed browser suite. Check all three browser statuses before considering the final cross-browser gate passed. No browser system libraries are installed by these scripts.

The standalone local design build remains marked noindex. The root production build is now separate: it emits `build/`, adds production metadata and Hosting headers, and excludes the studio guide. Following the user's explicit instruction to push `main` for existing CI/CD deployment, the root build and workflows have been migrated to the reviewed Astro site. See the root `RELEASE.md` for release authorization, evidence, and remaining limitations. Deployed legacy functions and shared cloud resources are preserved.
