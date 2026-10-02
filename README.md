# Sudharsana

A static personal studio for data engineering and applied AI, built with Astro, TypeScript, CSS, and a small locally bundled Motion interaction.

## Develop

Use Node 24.19.0 (`.nvmrc`):

```sh
npm ci
npm ci --prefix design-package --ignore-scripts
npm start
```

The reviewed application lives in `design-package/src/`. Its standalone lockfile owns the frontend dependencies. Earlier source at the repository root is legacy material and is not part of the active frontend build.

## Production build and checks

```sh
npm run check
npm run build
npm test
npm run preview
```

The production artifact is `build/`. Root preparation generates Hosting headers, sitemap, robots, provenance, and SHA-256 checksums. The local studio guide is excluded from production. Browser validation is an explicit additional command (`node scripts/production-browser.mjs`) with a preview on port 4322.

## Deployment

A push to `main` validates and deploys the exact packaged static artifact through the existing Firebase Hosting credentials. The build has no deployment credentials. The deployment job verifies archive/file hashes, installs deployment tooling before credentials, and deploys Hosting only, without checkout or application build scripts. PR validation publishes no preview and uses no production credentials.

See [RELEASE.md](RELEASE.md) for evidence, scope, limitations, and rollback information. The existing `functions/` code and deployed backend resources are preserved; they are not called by the new frontend or included in the Hosting artifact.

## Content and saved designs

Professional/personal work and career chapters use typed local collections. Source-review notes live in `design-package/CONTENT-REVIEW.md` and `RESUME-CONTENT-REVIEW.md`; visitor pages present direct high-level copy. Original fonts, illustrations, portrait variants, and social preview are self-hosted. Font licenses are shipped with the site.

Saved local versions: `design-v1-before-resume-expansion`, `design-v2-resume-expansion`, `design-v3-editorial-copy`. The original commit and branch history are preserved.
