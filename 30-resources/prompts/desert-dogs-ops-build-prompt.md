# Desert Dogs Ops — Executor Build Prompt (blind-run spec)

> This document is the contract an autonomous coder/engineer executor runs **blind**:
> it contains everything needed to build, verify, and maintain the site without
> access to the chat history. If a detail here contradicts the live code, the
> **live code is the source of truth** — but any drift must be reconciled, not
> silently worked around.

---

## 1. Goal

A fully professional, **bilingual (Arabic-first RTL + English toggle)**, animated,
open-source website for volunteers feeding / watering / rescuing stray dogs in
**Safawi** (Mafraq governorate, Baghdad / Highway-10 corridor) and **Dhulail**
(Zarqa governorate, private land), Jordan — and compiling evidence to replace
desert confinement with humane **ABC/TNR** (Animal Birth Control / Trap-Neuter-Return).

The site is **frontend-only**. No backend in Phase 1. A `dataAdapter` seam in the
store is the single swap point for a future Supabase backend (Phase 2).

---

## 2. Non-negotiable constraints

1. **No secrets, ever.** No Cesium Ion token, no API keys, no wallet addresses,
   no organizer home addresses. Esri World Imagery and OSM are **keyless** basemaps.
   If a layer needs a key, it is out of scope for Phase 1.
2. **No impersonation.** This is an independent open-source effort by two IT people,
   not affiliated with any municipality, NGO, or the GoFundMe organizer. The footer
   must carry a no-impersonation disclaimer.
3. **Citation provenance.** Every factual claim about the situation or the law must
   come from a source in `src/constants/sources.js`, which was **fetched and verified**
   (HTTP 200 / real content) on 2026-08-29. Do not add a source you have not fetched.
   Do not reintroduce the fictional "Animal Welfare Law No. 5 of 2017" — the real
   instrument is **Regulation No. 11 of 2010**, implemented by Instructions G/18 of 2022.
4. **Coordinate provenance.** `src/constants/sites.js` coordinates are **area anchors**
   (towns / roadside corridor), NOT verified enclosure/dump pins. Any marker rendered
   for a `precision: 'area'` site must be labelled approximate. Do not invent enclosure GPS.
5. **Accessibility is a hard gate, not a nicety.** The hero shader is verified to keep
   **≥ 4.5:1 WCAG contrast for white text** in the headline band (measured 5.01:1).
   Never ship a change that lets the sun glow or any bright element intrude into the
   upper text region. The shader's luminance `ceiling` (0.42) is the guard — keep it.
6. **Resilience over polish.** A shader/map failure must never blank the page. The
   `DesertShaderBackground` falls back to a CSS gradient when `navigator.gpu` is absent
   or init throws. Wrap the Cesium map in `RenderBoundary`. Honour `prefers-reduced-motion`.

---

## 3. Tech stack (exact pins — do not float)

Runtime deps (from `package.json`, verified in lockfile):
- `react@^19.2.0`, `react-dom@^19.2.0`
- `cesium@^1.139.1` + `vite-plugin-cesium@^1.2.23`  (keyless Esri basemap)
- `vgpu@0.3.1` (MIT, WebGPU/WGSL animation engine) — **pinned npm version**
- `zustand@^5.0.11` (state)
- `framer-motion@13.1.1` (scroll reveal)
- `lenis@1.3.26` (smooth scroll, reduced-motion gated)

Dev deps: `vite@^7.3.1`, `@vitejs/plugin-react@^5.1.4`, `tailwindcss@^4.2.1` +
`@tailwindcss/vite@^4.2.1`, `typescript@^5.9.3`, `eslint@^9.37.0` + plugins,
`vitest@^3.2.4`, `@testing-library/react`, `jsdom`, `@types/node@^22.20.1`.

Build scripts: `dev`, `build` (`vite build`), `preview`, `lint` (`eslint . --max-warnings=0`),
`typecheck` (`tsc --noEmit -p tsconfig.typecheck.json`), `test` (`vitest run`),
`ci` (lint && typecheck && test && build).

---

## 4. vGPU integration contract (verified — do not guess)

Proven headlessly via `vgpu/node` (adapter-mock). The call chain:

```js
const { init, effect, surface, frameLoop, uniforms } = await import('vgpu');
const gpu = await init();
const view = surface(gpu, canvas, { autoResize: true, dpr: [1, 2], alphaMode: 'opaque' });
const params = uniforms(gpu, { time: 0, aspect: 1, intensity: 1, reduced: 0 });
const fx = effect(gpu, DESERT_SHADER, { label: 'desert', set: { params } });
frameLoop(gpu, (frame) => {
  const [w, h] = view.size;
  params.set({ time: t, aspect: h > 0 ? w / h : 1 });
  frame.pass({ target: view, clear: true }, (pass) => pass.draw(fx));
});
```

- **`effect()` auto-injects the fullscreen vertex stage**, exposing `@location(0) uv`
  in the fragment shader. Do NOT write a vertex entry point.
- **`set` keys are binding NAMES** (`params`), not struct member names. The WGSL
  binding is `@group(0) @binding(0) var<uniform> params: Params;` (4×f32, size 16).
- **`target` uses `size: [w, h]`**, not `width`/`height`. (This is the single most
  common gotcha.)
- `frame.pass({ target: view, clear: true }, p => p.draw(fx))` — note `target: view`,
  not `target: view.target`.
- The shader source lives in `src/shaders/desertShader.js` and is a default export
  string of WGSL. It is the desert aesthetic: low-sun gradient, three dune ridges,
  sun bloom, vignette, film grain, reduced-motion slowdown.

The React wrapper `src/components/DesertShaderBackground.jsx` owns: capability probe
(`navigator.gpu`), dynamic import, full cleanup on unmount, visibility + IntersectionObserver
pause, error → CSS fallback. Treat it as the canonical resilience pattern.

---

## 5. i18n contract

`src/i18n/I18nProvider.jsx` exports `I18nProvider` + `useI18n()`. `useI18n()` returns:
`{ lang, dir, isRtl, setLang, toggleLang, t(key), L(value) }`.
- `t(key)` looks up `src/i18n/strings.js`; **missing keys fall back to the key itself**
  (so a gap is loud, never silent/English-bleed).
- `L({ ar, en })` localizes a bilingual object by current lang.
- `<html lang/dir>` is set from lang in an effect. AR is default (`DEFAULT_LANG='ar'`),
  dir flips to `rtl`. Persisted in `localStorage` under key `ddo.lang` (best-effort).
- Every user-facing string MUST go through `t()`. Do not hardcode English in JSX.

---

## 6. State contract (`src/store/useStore.js`)

Single Zustand store, sliced: `sites`, `inspector`, `mapReady/mapFailed/resetViewNonce`,
`rota` (volunteerName, rotaPending, `assignRota`, `completeRota`), `feedings`,
`dogCounts`, `photoLog`, `offers` (`offerStatus`, `submitOffer`, `resetOfferStatus`).

**`dataAdapter`** (in-file) is the Phase-2 swap seam: `saveOffer`, `saveRotaChange`,
`saveFeeding`. Today they resolve after a mock latency. Replacing this object with a
Supabase-backed one is the ONLY change needed to go live — components stay untouched.
All writes are async; components must read the `pending`/`offerStatus` flags.

---

## 7. File map (what exists vs. dead cruft)

**Active (imported by the app):**
```
src/main.jsx                       entry — wraps <I18nProvider><App/>
src/App.jsx                        shell: DesertNav + sections + SiteInspector + Lenis
src/components/DesertNav.jsx       AR/EN toggle, RTL-aware
src/components/DesertShaderBackground.jsx   WebGPU bg + CSS fallback
src/components/SiteInspector.jsx   dog-site inspector (replaces dead CCTV one)
src/components/DogSitesMap.jsx     Cesium, keyless Esri, status pins, click→inspector
src/components/Reveal.jsx          framer-motion scroll-reveal (reduced-motion safe)
src/components/RenderBoundary.jsx  error boundary
src/components/sections/{Hero,Problem,FieldOps,Evidence,GetInvolved,Footer}.jsx
src/i18n/{I18nProvider.jsx,strings.js}
src/store/useStore.js
src/constants/{sites.js,sources.js}
src/shaders/desertShader.js
src/index.css                     glass-panel design system, RTL via logical props
tests/store.test.js              5 passing unit tests (rota/offer/inspector)
```

**DEAD CRUFT — godseye leftovers, NOT imported, safe to delete:**
`src/components/Globe.jsx` (imports 26 deleted layers), `src/components/Inspector.jsx`
(CCTV-only, `returns null` for dog sites), `src/constants/globe.js`,
`src/utils/{entityMap,geo,cache,runtimeEnv}.js`, `src/types/global.d.ts`.
They survive lint only because nothing references them. A clean pass should remove them.

---

## 8. Verification gates (all must be GREEN before "done")

```
npm run ci     # lint + typecheck + test + build
```
- `lint`: zero warnings (`--max-warnings=0`).
- `typecheck`: `tsc --noEmit` clean (needs `@types/node`).
- `test`: `tests/store.test.js` 5/5 passing.
- `build`: `vite build` succeeds, Cesium + vgpu + lenis bundle.
- Dev server: `npm run dev` → HTTP 200, `dir="rtl"` document served.

**Visual gates (require a real browser/GPU — not verifiable headlessly here):**
- Cesium globe paints Esri satellite imagery (no token).
- WebGPU shader path engages on Chrome/Edge; CSS gradient fallback on Safari/Firefox.
- Hero keeps ≥4.5:1 text contrast (ceiling guard at 0.42).
- RTL mirror correct; `prefers-reduced-motion` disables Lenis + freezes shader clock.

---

## 9. Do NOT

- Do not add a Cesium Ion token or any keyed basemap.
- Do not hardcode English strings outside `strings.js`.
- Do not claim "Law No. 5 of 2017" — use Regulation No. 11 of 2010.
- Do not publish enclosure GPS; area anchors only.
- Do not remove the shader luminance ceiling or the CSS fallback.
- Do not add backend/auth code in Phase 1 — use the `dataAdapter` mock.

---

## 10. Acceptance criteria (definition of "done")

- [ ] `npm run ci` green on a clean checkout.
- [ ] All 7 sections present and scroll-reveal correctly.
- [ ] AR/EN toggle flips `dir` and all strings.
- [ ] Cesium map shows both sites, coloured by status, click opens inspector.
- [ ] Field Ops rota assign/complete + intake form submit work (mock) and persist in store.
- [ ] Every factual claim links a verified source; footer shows licenses + disclaimer.
- [ ] No console errors on load; shader fallback works without WebGPU.
