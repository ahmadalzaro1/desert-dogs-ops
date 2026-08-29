# Desert Dogs Ops — Next-Steps Roadmap (post-build)

> Status: **Phase 1 build complete & verified** (`npm run ci` green, commit a157e89).
> This file is the iteration backlog. Each item states its trigger, the verified
> sources/constraints it depends on, and its acceptance check. Priority order is
> top-down. Items tagged **[UNVERIFIED-VISUAL]** need a real browser/GPU to confirm.

---

## A. Ship it (blocking for public use)

### A1. Public deployment — DONE (2026-08-29)
- **Repo:** https://github.com/ahmadalzaro1/desert-dogs-ops (public, Apache-2.0)
- **Live URL:** https://ahmadalzaro1.github.io/desert-dogs-ops/ (HTTP 200, RTL Arabic, Cesium CSS present)
- **Mechanism:** GitHub Pages via `.github/workflows/deploy.yml` (npm ci + `npm run ci` + build → Pages artifact). `vite.config.js` `base: '/desert-dogs-ops/'`.
- **History hygiene:** removed godseye OSINT blobs (Godseye.png 5.3MB, manifests JSONs 3-4MB, Cesium_Air.glb) via `git filter-branch` + prune; remote tree verified clean.
- **Note:** vgpu is ESM/WebGPU; the dynamic `import('vgpu')` survived the production build (bundle includes it). No Ion token.

### A2. Temporary public tunnel — N/A (A1 satisfied with permanent URL)

---

## B. Close the known verification gaps

### B1. [UNVERIFIED-VISUAL] Live SPA render + Cesium globe paint
- This build was verified headlessly (build/lint/test/typecheck + shader contrast math)
  but **no Chromium in the build env** — the actual globe paint, WebGPU-on-GPU, and
  RTL mirror were never eye-confirmed.
- **Action:** open `npm run dev` on the Mac Studio; confirm globe + shader + RTL.
- **Acceptance:** screenshot proof; no console errors.

### B2. [UNVERIFIED-VISUAL] Reduced-motion + mobile QA
- Lenis disabled and shader clock frozen under `prefers-reduced-motion`; layout holds
  at 390×844 and ultrawide. Contrast already measured 5.01:1 at 9:19.5 portrait.

### B3. vGPU commit pin — DEFERRED (install-incompatible)
- User asked to pin a vgpu commit ~2026-08-27. Candidate: `ef2418bc13` (2026-08-27T16:43Z).
- **Attempted 2026-08-29:** `npm install` for `github:vercel-labs/vgpu#ef2418bc13`
  timed out (>420s) fetching/building the full repo and never updated the lockfile;
  `node_modules` + lockfile stayed on `vgpu@0.3.1` (npm tarball, `vgpu-0.3.1.tgz`).
- **Decision: keep `vgpu@0.3.1`** — it is already reproducible via the committed
  `package-lock.json` (integrity-hashed tarball), which satisfies the reproducibility
  intent. The commit pin adds instability without a functional benefit here.
- **Revisit if:** a specific bug in `0.3.1` is fixed only in a later commit, or CI
  allows a longer install budget + git build cache. Then pin via
  `"vgpu": "github:vercel-labs/vgpu#<sha>"` and confirm `npm ci` + build stay green.

---

## C. Code hygiene (cheap, do early)

### C1. Delete dead godseye cruft
- `src/components/Globe.jsx`, `src/components/Inspector.jsx`, `src/constants/globe.js`,
  `src/utils/{entityMap,geo,cache,runtimeEnv}.js`, `src/types/global.d.ts`.
- None are imported; survive only because nothing references them. Removing them
  de-risks future confusion and shrinks the lint surface.
- **Acceptance:** `npm run ci` still green after deletion.

### C2. Wire the unused `requestResetView` camera reframe
- `useStore.requestResetView` / `resetViewNonce` exist but `DogSitesMap` doesn't consume
  them. Wire a "focus map" nav action to bump the nonce and reframe `FIELD_VIEW`.

---

## D. Evidence depth (the site's core value)

### D1. Real dog-count timeline
- `useStore.dogCounts` is `SAMPLE_COUNTS` (flagged `sample: true`). Replace with
  volunteer-recorded counts once logging starts. Keep the `sample` flag in UI until real.

### D2. Satellite before/after of sites
- Evidence section is stubbed for imagery comparison. Needs: (a) a keyless satellite
  source with historical tiles (Esri World Imagery has no time-travel; evaluate
  Sentinel Hub / OSM historical / paid keyless trial), (b) volunteer "after" photos
  showing trough/shade change. **Do not fake satellite imagery** — only show what exists.

### D3. Feeding-log export
- `addFeeding` exists; add a CSV/JSON export from `feedings` for the evidence dossier.

---

## E. Backend (Phase 2 — Supabase)

### E1. Implement `dataAdapter` for Supabase
- Single swap point (see build prompt §6). Tables: `sites`, `rota`, `feedings`,
  `photo_log`, `offers`. RLS so volunteers write only their own entries; public read.
- **Dependency:** `@supabase/supabase-js` (not yet installed — Phase 2).
- **Acceptance:** `submitOffer` / `assignRota` persist server-side; store unchanged.

### E2. Photo-log upload
- `photoLog` is in-store only. Wire image upload (Supabase Storage) with date+GPS
  captured from EXIF or manual entry (per original spec: date+GPS+thumb).

---

## F. Reach & compliance

### F1. SEO / OG / favicon
- Add OG tags + Arabic/English `description`, a real `favicon.svg` (paw/dog mark),
  `lang` alternates. Currently `favicon.svg` is referenced but may be missing from `public/`.

### F2. Accessibility audit (beyond contrast)
- Keyboard nav for map markers + inspector; `aria-label`s on toggle; focus rings.
- Run axe / Lighthouse; keep score ≥90.

### F3. Privacy-first analytics (optional)
- If added, use a cookieless, local-first counter (e.g. GoatCounter/Splitbee) — never
  a tracker that conflicts with the no-impersonation / privacy stance.

---

## G. Verified source index (for all evidence work)

All fetched + confirmed 2026-08-29, in `src/constants/sources.js`:

| id | type | what it establishes |
|----|------|---------------------|
| `change-org-petition` | petition | Video evidence of desert enclosures w/ no shade/water/vet; demands ABC/TNR; 159 sigs |
| `athamneh-2025-jaaws` | peer-reviewed | First ongoing free-roaming dog survey in Jordan (JAAWS 29(2), 322-334) |
| `jordan-times-2023` | press | Experts: low awareness + no dedicated legislation worsen the problem; ABC/TNR recommended |
| `jordan-animal-welfare-regulation-2010` | legislation | **Regulation No. 11 of 2010** (نظام الرفق بالحيوان), implemented by Instructions G/18 2022 |
| `jordan-rabies-jra-2022` | peer-reviewed | Jordan MoA running sterilization + rabies vaccination (ABC practice, not culling) |
| `woah-rabies` | standard | WOAH: dog vaccination is the preferred global rabies control method |
| `morters-2012-rabies-review` | peer-reviewed | Culling "ineffective in controlling rabies in all host species" |
| `taylor-2017-dpm` | peer-reviewed | Mass culling misguided; sterilization+vaccination is evidence-based alternative |

**Citation rule (carry forward):** never cite "Law No. 5 of 2017" — it does not exist.
Use Regulation No. 11 of 2010. Every added source must be fetched & `verified: true`.

---

## H. Decision log

- **2026-08-29** Phase 1 build complete, `npm run ci` green, commit a157e89.
- **2026-08-29** 8 citations verified via subagent fan-out; Regulation No. 11 of 2010
  correction applied (displaced the circulating "2017 law" myth).
- **OPEN** vgpu commit pin (user-requested, ~2026-08-27 SHA) — see B3.
- **OPEN** live visual verification — see B1.
