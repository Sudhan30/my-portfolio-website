# Sudharsana local design package

This is version 02 of the runnable local design, expanded at the user's request with content from the DE and FDE résumés. It lives on `redesign/design-package`, in an isolated worktree created from `main` at `f8288606d3b918e214ee72b071ea4c7b9fcd3f6c`. No remote push, PR, workflow change, deployment, or cloud retirement has occurred.

Version 01 is preserved at commit `7feebbd2485d5d4738f52edf76c19bff7ce771e3`, local tag `design-v1-before-resume-expansion`, and `/home/sudhan0312/Desktop/sudharsana-design-snapshots/2026-10-02-design-v1/`. Its source and exact built-preview archives were checksum verified before these changes.

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

Open **http://127.0.0.1:4321/design/**. The preview server listens only on loopback. It serves built files with blocked connections, no indexing, and a real 404 response. Its `style-src-attr 'unsafe-inline'` allowance supports the local review swatches and Motion's element transforms; it is not the final production CSP.

## Review artifacts

- Homepage: `/`; [desktop](evidence/homepage-desktop.png) and [mobile](evidence/homepage-mobile.png).
- Professional work stories: `/work/gtm-agents/`, `/work/customer-identity/`, `/work/affiliate-pipeline/`; [professional section desktop](evidence/professional-section-desktop.png) and [mobile](evidence/professional-section-mobile.png), [GTM story desktop](evidence/professional-story-desktop.png) and [mobile](evidence/professional-story-mobile.png).
- Personal work stories: `/work/ai-chat/`, `/work/text-to-sql/`, `/work/freshprobe/`; [AI chat story desktop](evidence/work-story-desktop.png) and [mobile](evidence/work-story-mobile.png).
- Career, education, and certification: `/#experience`; [desktop](evidence/career-desktop.png) and [mobile](evidence/career-mobile.png).
- Typography, palette, and review questions: `/design/`; [desktop](evidence/design-system-desktop.png) and [mobile](evidence/design-system-mobile.png).
- Inference states: `/design/states/one/`, `/design/states/queue/`, `/design/states/prefix/`; [one request](evidence/inference-one.png), [busy queue](evidence/inference-queue.png), [shared prefix](evidence/inference-prefix.png).
- [Content review](CONTENT-REVIEW.md), [validation evidence](VALIDATION.md), and [release/rollback checklist](RELEASE-CHECKLIST.md).

The workbench has no startup animation. Each deliberate selection plays a short animation once. Reduced motion changes the state immediately. Native radios support keyboard and touch; without JavaScript, CSS updates the figure and all explanations remain visible. Motion is locally bundled through its small animation entrypoint. Portrait variants, fonts, CSS, and scripts are local assets. All six story links are local document navigation. Professional work, personal work, and career chapters use typed content collections.

The new visual treatment adds a featured professional story, illustrated project cards, contextual scope figures, connected career chapters, and an original certification stamp. Hover details respect reduced motion. Raw résumés, personal phone/email, and internal documents are not copied into the source or artifact. Résumé outcomes are labeled with their actual scope; they are not independent verification.

## Reproduce browser checks

Keep the preview server running in a separate terminal:

```sh
npx playwright install chromium firefox webkit
npm run test:browser
```

The script saves structured results and screenshots in `evidence/`. Unavailable browsers are recorded explicitly. It fails on actual layout, behavior, or serious/critical accessibility failures, and requires at least one completed browser suite. Check all three browser statuses before considering the final cross-browser gate passed. No browser system libraries are installed by these scripts.

Production CRA files, Firebase settings, functions, deployment scripts, and legacy workflows are preserved at the worktree root. **Do not push or open a PR before the separately approved legacy-workflow safeguards sequence.** The package is marked noindex and is not a deployable release candidate.
