/**
 * Desert ambient shader — WGSL fragment source for vgpu's `effect()`.
 *
 * vgpu generates the fullscreen vertex stage when the source has no vertex entry
 * point, handing the fragment stage `@location(0) uv` (see vgpu 0.3.1
 * effect.js/fullscreenSource: uv spans a fullscreen triangle, so uv is in
 * [0,1] across the visible quad, y increasing downward from the top).
 *
 * Aesthetic brief: low sun gradient, heat shimmer, drifting sand. Deliberately
 * cheap — value-noise fbm, no textures, no compute — because this runs behind
 * page content on unknown hardware, including a phone in the field.
 */

export const DESERT_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  aspect: f32,
  intensity: f32,
  reduced: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

// ── hash / value noise ─────────────────────────────────────
fn hash21(p: vec2f) -> f32 {
  var q = fract(p * vec2f(123.34, 456.21));
  q += dot(q, q + 45.32);
  return fract(q.x * q.y);
}

fn noise21(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  // smoothstep-style quintic-ish easing keeps the dunes soft
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p: vec2f) -> f32 {
  var sum = 0.0;
  var amp = 0.5;
  var freq = p;
  for (var i = 0; i < 5; i = i + 1) {
    sum = sum + amp * noise21(freq);
    freq = freq * 2.02;
    amp = amp * 0.5;
  }
  return sum;
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  // Aspect-corrected coordinates; y flipped so 0 = horizon-down, 1 = sky.
  let t = params.time * mix(1.0, 0.25, params.reduced);
  var p = vec2f(uv.x * params.aspect, 1.0 - uv.y);
  let sky = 1.0 - uv.y;

  // ── low sun gradient ────────────────────────────────────
  // The horizon sits LOW (0.30 = 30% up from the bottom, i.e. 70% down the
  // screen). This is a text-contrast decision, not just taste: the hero
  // headline occupies the upper-middle of the viewport, so the bright warm
  // band must stay below it. Peak luminance is deliberately capped — see the
  // ceiling applied at the end of this function.
  let horizon = 0.30;
  let sunPos = vec2f(0.62 * params.aspect, horizon + 0.015);
  let sunDist = length((p - sunPos) * vec2f(0.85, 1.5));

  let deepSky   = vec3f(0.045, 0.060, 0.120);
  let midSky    = vec3f(0.215, 0.170, 0.225);
  let dusk      = vec3f(0.720, 0.385, 0.195);
  // Dunes read as SILHOUETTES against the glow: both dune tones are darker
  // than the horizon band, which is what creates a visible terrain edge.
  let duneFar   = vec3f(0.330, 0.225, 0.180);
  let duneNear  = vec3f(0.150, 0.105, 0.090);
  let duneDeep  = vec3f(0.055, 0.040, 0.038);

  // vertical sky ramp
  var col = mix(midSky, deepSky, clamp((sky - horizon) / 0.70, 0.0, 1.0));
  // warm band hugging the horizon
  let band = exp(-abs(sky - horizon) * 8.0);
  col = mix(col, dusk, band * 0.62);
  // sun bloom — the focal point. Sits at ~70% viewport height, well below the
  // hero text band, so it can carry real intensity without hurting legibility.
  let bloom = exp(-sunDist * 3.0);
  col = col + dusk * bloom * 0.85;
  col = col + vec3f(1.0, 0.90, 0.70) * exp(-sunDist * 14.0) * 0.75;

  // ── heat shimmer ────────────────────────────────────────
  // Strongest just above the ground plane, where hot air rises.
  let heatMask = exp(-max(sky - horizon, 0.0) * 5.0);
  let shimmer = sin((p.x * 26.0) + t * 2.1 + fbm(p * 6.0 + vec2f(0.0, t * 0.5)) * 6.28)
              * 0.0045 * heatMask * params.intensity;
  var pw = p;
  pw.y = pw.y + shimmer;

  // ── dunes: three overlapping ridges ─────────────────────
  // Layered back-to-front so each ridge occludes the one behind it. Different
  // drift rates give parallax; each layer is darker than the last, so the
  // silhouette edges stay readable against the glow.
  let ridgeFar = horizon
            - 0.015
            + 0.045 * fbm(vec2f(pw.x * 1.10 + t * 0.010, 3.7))
            + 0.018 * fbm(vec2f(pw.x * 2.70 + t * 0.006, 9.1));
  let ridgeMid = horizon
            - 0.075
            + 0.055 * fbm(vec2f(pw.x * 0.85 - t * 0.016, 17.3))
            + 0.020 * fbm(vec2f(pw.x * 2.10 - t * 0.009, 23.5));
  let ridgeNear = horizon
            - 0.165
            + 0.070 * fbm(vec2f(pw.x * 0.60 + t * 0.024, 31.9))
            + 0.024 * fbm(vec2f(pw.x * 1.55 + t * 0.013, 41.2));

  // Anti-aliased crest for each ridge (sky above, dune below).
  let eFar  = smoothstep(ridgeFar + 0.004, ridgeFar - 0.004, sky);
  let eMid  = smoothstep(ridgeMid + 0.004, ridgeMid - 0.004, sky);
  let eNear = smoothstep(ridgeNear + 0.005, ridgeNear - 0.005, sky);

  // Farthest dune: catches a little of the sun sheen along its lit flank.
  var farCol = duneFar;
  let farSheen = exp(-abs(pw.x - sunPos.x) * 1.15) * 0.30;
  farCol = farCol + dusk * farSheen;
  col = mix(col, farCol, eFar);

  // Middle dune.
  col = mix(col, duneNear, eMid);

  // Nearest dune: darkest, with drifting sand grain across its face.
  let drift = vec2f(t * 0.085, t * 0.020);
  let grain = fbm((pw + drift) * vec2f(11.0, 30.0));
  let nearCol = duneDeep * (0.82 + grain * 0.36);
  col = mix(col, nearCol, eNear);

  let ground = max(eFar, max(eMid, eNear));

  // ── airborne dust above the horizon ─────────────────────
  let dustDrift = vec2f(t * 0.13, -t * 0.03);
  let dust = fbm((pw + dustDrift) * vec2f(3.4, 7.0)) - 0.5;
  col = col + vec3f(0.55, 0.40, 0.28) * dust * 0.055 * (1.0 - ground) * params.intensity;

  // ── vignette + subtle film grain ────────────────────────
  let vigUv = uv - vec2f(0.5, 0.5);
  let vig = 1.0 - dot(vigUv, vigUv) * 0.85;
  col = col * clamp(vig, 0.0, 1.0);
  col = col + (hash21(uv * 1024.0 + vec2f(t, t)) - 0.5) * 0.016;

  // ── text-contrast ceiling ───────────────────────────────
  // This is the accessibility guard, in the shader rather than in CSS. White
  // hero text needs a dark backdrop; an unbounded sun bloom would blow out to
  // near-white and destroy that. Rather than clamp per-channel (which shifts
  // hue toward grey), scale the whole colour down once relative luminance
  // exceeds the ceiling, preserving the dusk hue while guaranteeing a
  // headroom floor for foreground text.
  let lum = dot(col, vec3f(0.2126, 0.7152, 0.0722));
  let ceiling = 0.42;
  if (lum > ceiling) {
    col = col * (ceiling / lum);
  }

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
`;

export default DESERT_SHADER;
