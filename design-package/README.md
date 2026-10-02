# Sudharsana local design package

This is the first review gate in the supplied plan: a runnable local design, rather than the full production migration. It lives on `redesign/design-package`, in an isolated worktree created from `main` at `f8288606d3b918e214ee72b071ea4c7b9fcd3f6c`. No remote push, PR, workflow change, deployment, or cloud retirement has occurred.

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
- Complete AI chat work story: `/work/ai-chat/`; [desktop](evidence/work-story-desktop.png) and [mobile](evidence/work-story-mobile.png).
- Typography, palette, and review questions: `/design/`; [desktop](evidence/design-system-desktop.png) and [mobile](evidence/design-system-mobile.png).
- Inference states: `/design/states/one/`, `/design/states/queue/`, `/design/states/prefix/`; [one request](evidence/inference-one.png), [busy queue](evidence/inference-queue.png), [shared prefix](evidence/inference-prefix.png).
- [Content review](CONTENT-REVIEW.md), [validation evidence](VALIDATION.md), and [release/rollback checklist](RELEASE-CHECKLIST.md).

The workbench has no startup animation. Each deliberate selection plays a short animation once. Reduced motion changes the state immediately. Native radios support keyboard and touch; without JavaScript, CSS updates the figure and all explanations remain visible. Motion is locally bundled through its small animation entrypoint. Portrait variants, fonts, CSS, and scripts are local assets. The two remaining story previews link to their public sources pending the full build.

## Reproduce browser checks

Keep the preview server running in a separate terminal:

```sh
npx playwright install chromium firefox webkit
npm run test:browser
```

The script saves structured results and screenshots in `evidence/`. Unavailable browsers are recorded explicitly. It fails on actual layout, behavior, or serious/critical accessibility failures, and requires at least one completed browser suite. Check all three browser statuses before considering the final cross-browser gate passed. No browser system libraries are installed by these scripts.

Production CRA files, Firebase settings, functions, deployment scripts, and legacy workflows are preserved at the worktree root. **Do not push or open a PR before the separately approved legacy-workflow safeguards sequence.** The package is marked noindex and is not a deployable release candidate.
