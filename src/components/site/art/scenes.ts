/**
 * Motion graphics for the ten services (and the RADcruiters automation),
 * drawn on a 2D canvas in the same thin-line, dotted vocabulary as DotArt.
 *
 * Every scene is a pure function of size and time, so it loops forever,
 * renders a sensible still for reduced motion, and costs nothing when the
 * canvas is off screen. Sizes come from one unit, U = min(w, 1.1h) / 9.2:
 * the subject sits in a box about 7.6U wide around (w/2, 0.47h), so it reads
 * in a narrow hero strip, a square card and a phone-width panel alike.
 */

export type Ink = (alpha: number) => string;
export type Pal = { fg: Ink; ac: Ink; ink: Ink; bg: string };
export type Scene = (c: CanvasRenderingContext2D, w: number, h: number, t: number, p: Pal) => void;

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eout = (t: number) => 1 - Math.pow(1 - t, 3);
/** 0→1 as p goes from a to b. */
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
/** Deterministic noise in [0, 1). */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function frame(w: number, h: number) {
  const U = Math.min(w, h * 1.1) / 9.2;
  return { U, cx: w / 2, cy: h * 0.47, lw: Math.max(1, U * 0.018) };
}

function base(c: CanvasRenderingContext2D, w: number, h: number, p: Pal) {
  const { U, cx, cy } = frame(w, h);
  c.fillStyle = p.bg;
  c.fillRect(0, 0, w, h);
  const g = U * 0.5;
  c.fillStyle = p.fg(0.08);
  for (let x = cx % g; x < w; x += g) for (let y = cy % g; y < h; y += g) c.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
}

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, Math.max(0, w), Math.max(0, h), Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
}

function bar(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  if (w <= 0) return;
  c.fillStyle = color;
  c.fillRect(x, y, w, h);
}

function dot(c: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fillStyle = color;
  c.fill();
}

/** Point at fraction e along a polyline. */
function along(pts: [number, number][], e: number): [number, number] {
  const lens = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  let d = e * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const f = lens[i] ? clamp(d / lens[i]) : 0;
      return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)];
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}

function polyline(c: CanvasRenderingContext2D, pts: [number, number][]) {
  c.beginPath();
  c.moveTo(pts[0][0], pts[0][1]);
  for (const q of pts.slice(1)) c.lineTo(q[0], q[1]);
}

function mountain(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, U: number, color: string) {
  c.strokeStyle = color;
  c.beginPath();
  c.moveTo(x, y + h);
  c.lineTo(x + w * 0.35, y + h * 0.45);
  c.lineTo(x + w * 0.55, y + h * 0.7);
  c.lineTo(x + w * 0.75, y + h * 0.48);
  c.lineTo(x + w, y + h * 0.8);
  c.stroke();
  c.beginPath();
  c.arc(x + w * 0.76, y + h * 0.26, Math.min(w, h) * 0.12, 0, TAU);
  c.stroke();
}

function heart(c: CanvasRenderingContext2D, x: number, y: number, s: number) {
  c.beginPath();
  c.moveTo(x, y + s * 0.3);
  c.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
  c.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.78, x, y + s);
  c.bezierCurveTo(x, y + s * 0.78, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
  c.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
}

/* ───────────────────────── Website development ─────────────────────────
   A browser window whose page builds itself block by block, then a cursor
   clicks the call to action. */
const website: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  const q = (t % 7) / 7;
  const fade = 1 - seg(q, 0.9, 1);
  const W = 7.6 * U, H = 5.2 * U, x0 = cx - W / 2, y0 = cy - H / 2, top = 0.55 * U;
  c.lineWidth = lw;
  c.strokeStyle = p.fg(0.85);
  rr(c, x0, y0, W, H, 0.16 * U);
  c.stroke();
  c.beginPath();
  c.moveTo(x0, y0 + top);
  c.lineTo(x0 + W, y0 + top);
  c.stroke();
  for (let i = 0; i < 3; i++) dot(c, x0 + 0.3 * U + i * 0.22 * U, y0 + top / 2, 0.06 * U, p.fg(0.45));
  c.strokeStyle = p.fg(0.3);
  rr(c, cx - 1.6 * U, y0 + top * 0.25, 3.2 * U, top * 0.5, top * 0.25);
  c.stroke();

  const ix = x0 + 0.45 * U, iy = y0 + top + 0.35 * U, iw = W - 0.9 * U;
  c.globalAlpha = fade;
  bar(c, ix, iy, 0.8 * U * eout(seg(q, 0.04, 0.12)), 0.16 * U, p.fg(0.9));
  for (let i = 0; i < 4; i++) bar(c, ix + iw - (4 - i) * 0.7 * U, iy + 0.04 * U, 0.5 * U * eout(seg(q, 0.06 + i * 0.02, 0.14 + i * 0.02)), 0.08 * U, p.fg(0.45));

  const hy = iy + 0.65 * U;
  bar(c, ix, hy, 3.4 * U * eio(seg(q, 0.14, 0.24)), 0.26 * U, p.fg(0.9));
  bar(c, ix, hy + 0.42 * U, 2.6 * U * eio(seg(q, 0.2, 0.3)), 0.26 * U, p.fg(0.9));
  for (let k = 0; k < 2; k++) bar(c, ix, hy + 0.95 * U + k * 0.2 * U, (2.8 - k * 0.6) * U * eio(seg(q, 0.28 + k * 0.03, 0.36 + k * 0.03)), 0.08 * U, p.fg(0.35));

  const bx = ix, by = hy + 1.5 * U, bw = 1.3 * U, bh = 0.38 * U;
  const eb = eout(seg(q, 0.36, 0.44));
  const press = seg(q, 0.76, 0.8) * (1 - seg(q, 0.8, 0.86));
  if (eb > 0) {
    c.fillStyle = p.ac(0.95);
    rr(c, bx + press * 0.04 * U, by + press * 0.03 * U, bw * eb - press * 0.08 * U, bh - press * 0.06 * U, 0.04 * U);
    c.fill();
    bar(c, bx + 0.2 * U, by + bh / 2 - 0.04 * U, 0.6 * U * eb, 0.08 * U, p.ink(0.9));
  }

  const ei = eio(seg(q, 0.3, 0.42));
  const mx = ix + iw * 0.56, my = iy + 0.6 * U, mw = iw * 0.44, mh = 2.2 * U;
  c.strokeStyle = p.fg(0.6);
  c.strokeRect(mx, my, mw, mh * ei);
  if (ei > 0.99) mountain(c, mx, my, mw, mh, U, p.fg(0.4));

  const ry = iy + 3.05 * U, cw = (iw - 0.5 * U) / 3;
  for (let i = 0; i < 3; i++) {
    const e = eout(seg(q, 0.48 + i * 0.05, 0.58 + i * 0.05));
    if (e <= 0) continue;
    const x = ix + i * (cw + 0.25 * U), y = ry + (1 - e) * 0.3 * U;
    c.globalAlpha = fade * e;
    c.strokeStyle = p.fg(0.55);
    c.strokeRect(x, y, cw, 1.0 * U);
    bar(c, x + 0.15 * U, y + 0.2 * U, cw * 0.6, 0.08 * U, p.fg(0.35));
    bar(c, x + 0.15 * U, y + 0.4 * U, cw * 0.4, 0.08 * U, p.fg(0.25));
  }
  c.globalAlpha = fade;

  const ring = seg(q, 0.78, 0.9);
  if (ring > 0 && ring < 1) {
    c.strokeStyle = p.ac(0.8 * (1 - ring));
    rr(c, bx - ring * 0.5 * U, by - ring * 0.5 * U, bw + ring * U, bh + ring * U, 0.1 * U + ring * 0.3 * U);
    c.stroke();
  }
  const m = eio(seg(q, 0.6, 0.74));
  const kx = lerp(cx + 2.6 * U, bx + bw * 0.6, m), ky = lerp(cy + 2.3 * U, by + bh * 0.55, m);
  if (q > 0.55) {
    const s = U * (1 - press * 0.15);
    c.beginPath();
    c.moveTo(kx, ky);
    c.lineTo(kx, ky + 0.42 * s);
    c.lineTo(kx + 0.1 * s, ky + 0.32 * s);
    c.lineTo(kx + 0.18 * s, ky + 0.5 * s);
    c.lineTo(kx + 0.24 * s, ky + 0.47 * s);
    c.lineTo(kx + 0.16 * s, ky + 0.3 * s);
    c.lineTo(kx + 0.3 * s, ky + 0.3 * s);
    c.closePath();
    c.fillStyle = p.fg(0.95);
    c.fill();
    c.strokeStyle = p.bg;
    c.stroke();
  }
  c.globalAlpha = 1;
};

/* ───────────────────────── Software development ────────────────────────
   A service graph: packets run the edges and light the node they reach. */
const software: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  const N: [number, number][] = [[-3, 0], [-1, -1.5], [-1, 1.5], [1, -1.5], [1, 0], [1, 1.5], [3, 0]];
  const E: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 6], [4, 6], [5, 6]];
  const nw = 1.4 * U, nh = 0.66 * U;
  const pos = (i: number): [number, number] => [cx + N[i][0] * U * 1.12, cy + N[i][1] * U * 1.05];
  const path = (a: number, b: number): [number, number][] => {
    const [ax, ay] = pos(a), [bx, by] = pos(b);
    const x1 = ax + nw / 2, x2 = bx - nw / 2, mx = (x1 + x2) / 2;
    return [[x1, ay], [mx, ay], [mx, by], [x2, by]];
  };
  c.lineWidth = lw;
  c.strokeStyle = p.fg(0.28);
  for (const [a, b] of E) {
    polyline(c, path(a, b));
    c.stroke();
  }
  const flash = N.map(() => 0);
  E.forEach(([a, b], k) => {
    const P = 2.2 + rnd(k) * 0.8;
    const ph = ((t + rnd(k + 9) * P) % P) / P;
    if (ph < 0.7) {
      const [x, y] = along(path(a, b), eio(ph / 0.7));
      dot(c, x, y, 0.07 * U, p.ac(0.95));
    } else flash[b] = Math.max(flash[b], 1 - seg(ph, 0.7, 1));
  });
  N.forEach((_, i) => {
    const [x, y] = pos(i);
    const f = i === 0 ? 0.35 + 0.35 * Math.sin(t * 2) ** 2 : flash[i];
    c.fillStyle = p.bg;
    rr(c, x - nw / 2, y - nh / 2, nw, nh, 0.1 * U);
    c.fill();
    if (f > 0) {
      c.fillStyle = p.ac(0.9 * f);
      c.fill();
    }
    c.strokeStyle = p.fg(0.8);
    c.stroke();
    const tc = f > 0.5 ? p.ink(0.85) : p.fg(0.75);
    bar(c, x - nw / 2 + 0.16 * U, y - 0.12 * U, nw * 0.55, 0.08 * U, tc);
    bar(c, x - nw / 2 + 0.16 * U, y + 0.06 * U, nw * 0.35, 0.06 * U, f > 0.5 ? p.ink(0.5) : p.fg(0.3));
  });
};

/* ───────────────────────── Mobile apps ─────────────────────────────────
   A phone with a scrolling feed, a tab bar whose indicator hops, and a
   notification that drops in. Two UI chips float beside it. */
const mobile: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  c.lineWidth = lw;
  const chips: [number, number, number, number][] = [
    [cx - 3.5 * U, cy - 1.3 * U + Math.sin(t * 1.1) * 0.12 * U, 1.7 * U, 0.6 * U],
    [cx + 1.9 * U, cy + 0.9 * U + Math.cos(t * 0.9) * 0.12 * U, 1.8 * U, 0.6 * U],
  ];
  chips.forEach(([x, y, cw, ch], i) => {
    c.fillStyle = p.bg;
    rr(c, x, y, cw, ch, ch / 2);
    c.fill();
    c.strokeStyle = p.fg(0.45);
    c.stroke();
    if (i === 0) {
      const on = Math.sin(t * 0.8) > 0;
      c.fillStyle = on ? p.ac(0.9) : p.fg(0.15);
      rr(c, x + cw - 0.75 * U, y + 0.15 * U, 0.55 * U, 0.3 * U, 0.15 * U);
      c.fill();
      dot(c, x + cw - (on ? 0.35 : 0.6) * U, y + 0.3 * U, 0.11 * U, on ? p.ink(0.9) : p.fg(0.7));
      bar(c, x + 0.25 * U, y + 0.26 * U, 0.6 * U, 0.08 * U, p.fg(0.6));
    } else {
      dot(c, x + 0.32 * U, y + 0.3 * U, 0.14 * U, p.ac(0.9));
      bar(c, x + 0.6 * U, y + 0.2 * U, 0.9 * U, 0.08 * U, p.fg(0.7));
      bar(c, x + 0.6 * U, y + 0.34 * U, 0.6 * U, 0.06 * U, p.fg(0.3));
    }
  });

  const PW = 3.1 * U, PH = 6.3 * U, px = cx - PW / 2, py = cy - PH / 2, r = 0.42 * U;
  c.fillStyle = p.bg;
  rr(c, px, py, PW, PH, r);
  c.fill();
  c.lineWidth = lw * 1.3;
  c.strokeStyle = p.fg(0.9);
  c.stroke();
  c.lineWidth = lw;
  const sx = px + 0.14 * U, sy = py + 0.14 * U, sw = PW - 0.28 * U, sh = PH - 0.28 * U;
  c.save();
  rr(c, sx, sy, sw, sh, r * 0.75);
  c.clip();
  const ch = 0.95 * U, gap = 0.22 * U, step = ch + gap, listTop = sy + 1.05 * U, speed = 0.5 * U;
  const off = (t * speed) % step, first = Math.floor((t * speed) / step);
  for (let i = -1; i < 8; i++) {
    const y = listTop + i * step - off;
    const acc = (first + i) % 5 === 2;
    rr(c, sx + 0.22 * U, y, sw - 0.44 * U, ch, 0.12 * U);
    if (acc) {
      c.fillStyle = p.ac(0.92);
      c.fill();
    } else {
      c.strokeStyle = p.fg(0.4);
      c.stroke();
    }
    dot(c, sx + 0.62 * U, y + ch / 2, 0.2 * U, acc ? p.ink(0.85) : p.fg(0.25));
    bar(c, sx + 0.98 * U, y + ch * 0.36, sw * 0.45, 0.08 * U, acc ? p.ink(0.85) : p.fg(0.7));
    bar(c, sx + 0.98 * U, y + ch * 0.56, sw * 0.28, 0.06 * U, acc ? p.ink(0.55) : p.fg(0.3));
  }
  c.fillStyle = p.bg;
  c.fillRect(sx, sy, sw, 0.95 * U);
  bar(c, sx + 0.25 * U, sy + 0.62 * U, 1.1 * U, 0.14 * U, p.fg(0.9));
  dot(c, sx + sw - 0.4 * U, sy + 0.68 * U, 0.12 * U, p.fg(0.35));
  const tb = 0.8 * U;
  c.fillStyle = p.bg;
  c.fillRect(sx, sy + sh - tb, sw, tb);
  c.strokeStyle = p.fg(0.2);
  c.beginPath();
  c.moveTo(sx, sy + sh - tb);
  c.lineTo(sx + sw, sy + sh - tb);
  c.stroke();
  const tabX = (i: number) => sx + sw * (0.14 + i * 0.24);
  for (let i = 0; i < 4; i++) dot(c, tabX(i), sy + sh - tb * 0.55, 0.09 * U, p.fg(0.55));
  const k = t / 2, cur = Math.floor(k) % 4, prev = (cur + 3) % 4, mv = eio(clamp((k % 1) * 4));
  const ax = lerp(tabX(prev), tabX(cur), cur === 0 ? 1 : mv);
  bar(c, ax - 0.2 * U, sy + sh - tb * 0.22, 0.4 * U, 0.07 * U, p.ac(0.95));
  const nq = (t % 5) / 5;
  const drop = eout(seg(nq, 0, 0.08)) * (1 - eio(seg(nq, 0.45, 0.55)));
  if (drop > 0) {
    const ny = sy - 0.9 * U + drop * 1.2 * U;
    c.fillStyle = p.bg;
    rr(c, sx + 0.18 * U, ny, sw - 0.36 * U, 0.72 * U, 0.18 * U);
    c.fill();
    c.strokeStyle = p.ac(0.95);
    c.stroke();
    dot(c, sx + 0.55 * U, ny + 0.36 * U, 0.14 * U, p.ac(0.95));
    bar(c, sx + 0.85 * U, ny + 0.24 * U, sw * 0.42, 0.08 * U, p.fg(0.8));
    bar(c, sx + 0.85 * U, ny + 0.4 * U, sw * 0.3, 0.06 * U, p.fg(0.35));
  }
  c.restore();
  c.fillStyle = p.fg(0.85);
  rr(c, cx - 0.45 * U, sy + 0.12 * U, 0.9 * U, 0.24 * U, 0.12 * U);
  c.fill();
};

/* ───────────────────────── Social media management ─────────────────────
   A 3×3 grid of posts arrives in a wave, likes float up off the corner,
   and a story ring spins above it. */
const social: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  c.lineWidth = lw;
  const q = (t % 6) / 6;
  const T = 1.5 * U, g = 0.14 * U, S = 3 * T + 2 * g, gx = cx - S / 2, gy = cy - S / 2 + 0.35 * U;

  const sx = gx + 0.35 * U, sy = gy - 0.78 * U;
  c.save();
  c.setLineDash([0.1 * U, 0.08 * U]);
  c.lineDashOffset = -t * U * 0.3;
  c.strokeStyle = p.ac(0.95);
  c.beginPath();
  c.arc(sx, sy, 0.32 * U, 0, TAU);
  c.stroke();
  c.restore();
  dot(c, sx, sy, 0.22 * U, p.fg(0.2));
  bar(c, sx + 0.55 * U, sy - 0.1 * U, 1.3 * U, 0.09 * U, p.fg(0.8));
  bar(c, sx + 0.55 * U, sy + 0.06 * U, 0.8 * U, 0.06 * U, p.fg(0.3));

  for (let r = 0; r < 3; r++)
    for (let k = 0; k < 3; k++) {
      const i = r * 3 + k, d = (r + k) * 0.05;
      const e = eout(seg(q, d, d + 0.14)) * (1 - eio(seg(q, 0.82 + d * 0.4, 0.9 + d * 0.4)));
      if (e <= 0) continue;
      const x = gx + k * (T + g), y = gy + r * (T + g) + (1 - e) * 0.25 * U;
      c.globalAlpha = e;
      if (i === 4) {
        c.fillStyle = p.ac(0.92);
        c.fillRect(x, y, T, T);
        c.beginPath();
        c.moveTo(x + T * 0.42, y + T * 0.34);
        c.lineTo(x + T * 0.66, y + T * 0.5);
        c.lineTo(x + T * 0.42, y + T * 0.66);
        c.closePath();
        c.fillStyle = p.ink(0.9);
        c.fill();
      } else {
        c.strokeStyle = p.fg(0.5);
        c.strokeRect(x, y, T, T);
        c.strokeStyle = p.fg(0.35);
        const kind = i % 3;
        if (kind === 0) {
          c.beginPath();
          c.arc(x + T / 2, y + T / 2, T * 0.22, 0, TAU);
          c.stroke();
        } else if (kind === 1) mountain(c, x + T * 0.12, y + T * 0.2, T * 0.76, T * 0.6, U, p.fg(0.35));
        else for (let b = 0; b < 3; b++) bar(c, x + T * 0.18, y + T * (0.32 + b * 0.16), T * (0.64 - b * 0.16), 0.06 * U, p.fg(0.35));
      }
    }
  c.globalAlpha = 1;

  const hx = gx + S - 0.5 * U, hy = gy + S - 0.2 * U;
  for (let k = 0; k < 9; k++) {
    const P = 2.6 + rnd(k) * 1.2;
    const e = ((t + rnd(k + 4) * P) % P) / P;
    const x = hx + (rnd(k + 2) - 0.5) * 0.6 * U + Math.sin(e * 6 + k) * 0.2 * U;
    const y = hy - e * 3.2 * U;
    const s = (0.22 + rnd(k + 6) * 0.14) * U;
    c.globalAlpha = Math.sin(e * Math.PI);
    heart(c, x, y, s);
    c.fillStyle = p.ac(0.95);
    c.fill();
  }
  c.globalAlpha = 1;
  const cx2 = gx + S - 1.9 * U, cy2 = gy + S + 0.35 * U;
  c.fillStyle = p.bg;
  rr(c, cx2, cy2, 1.9 * U, 0.55 * U, 0.275 * U);
  c.fill();
  c.strokeStyle = p.fg(0.5);
  c.stroke();
  heart(c, cx2 + 0.3 * U, cy2 + 0.15 * U, 0.26 * U);
  c.fillStyle = p.ac(0.95);
  c.fill();
  bar(c, cx2 + 0.6 * U, cy2 + 0.24 * U, (0.5 + 0.6 * ((t * 0.25) % 1)) * U, 0.08 * U, p.fg(0.8));
};

/* ───────────────────────── SEO, AEO & GEO ──────────────────────────────
   A query types itself, one result climbs to the top, and an answer card
   (the AI answer that names it) pops out of the corner. */
const seo: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  c.lineWidth = lw;
  const q = (t % 8) / 8;
  const fade = 1 - seg(q, 0.92, 1);
  const SW = 7.2 * U, sx = cx - SW / 2, sy = cy - 2.75 * U, sh = 0.75 * U;
  c.strokeStyle = p.fg(0.85);
  rr(c, sx, sy, SW, sh, sh / 2);
  c.stroke();
  c.beginPath();
  c.arc(sx + 0.42 * U, sy + sh / 2 - 0.03 * U, 0.15 * U, 0, TAU);
  c.moveTo(sx + 0.53 * U, sy + sh / 2 + 0.08 * U);
  c.lineTo(sx + 0.66 * U, sy + sh / 2 + 0.21 * U);
  c.stroke();
  const ty = eio(seg(q, 0.02, 0.16));
  bar(c, sx + 0.9 * U, sy + sh / 2 - 0.05 * U, 2.8 * U * ty, 0.1 * U, p.fg(0.85));
  if (Math.floor(t * 2) % 2 === 0) bar(c, sx + 0.95 * U + 2.8 * U * ty, sy + sh * 0.28, 0.04 * U, sh * 0.44, p.ac(0.95));

  const steps = [0.22, 0.36, 0.5, 0.64];
  const accentPos = 4 - steps.reduce((a, s) => a + eio(seg(q, s, s + 0.08)), 0);
  const rowY = (k: number) => cy - 1.55 * U + k * 0.85 * U, rh = 0.64 * U;
  c.globalAlpha = fade;
  for (let i = 0; i < 4; i++) {
    const y = rowY(i + clamp(i + 1 - accentPos));
    c.strokeStyle = p.fg(0.3);
    rr(c, sx, y, SW, rh, 0.1 * U);
    c.stroke();
    c.strokeStyle = p.fg(0.4);
    c.strokeRect(sx + 0.2 * U, y + 0.17 * U, 0.3 * U, 0.3 * U);
    bar(c, sx + 0.7 * U, y + 0.18 * U, (2.6 - rnd(i) * 0.8) * U, 0.1 * U, p.fg(0.7));
    bar(c, sx + 0.7 * U, y + 0.38 * U, 1.5 * U, 0.06 * U, p.fg(0.28));
  }
  const ay = rowY(accentPos);
  c.fillStyle = p.ac(0.95);
  rr(c, sx, ay, SW, rh, 0.1 * U);
  c.fill();
  c.fillStyle = p.ink(0.85);
  c.fillRect(sx + 0.2 * U, ay + 0.17 * U, 0.3 * U, 0.3 * U);
  bar(c, sx + 0.7 * U, ay + 0.18 * U, 3.0 * U, 0.1 * U, p.ink(0.85));
  bar(c, sx + 0.7 * U, ay + 0.38 * U, 1.6 * U, 0.06 * U, p.ink(0.55));
  const rank = eout(seg(q, 0.62, 0.7));
  bar(c, sx + SW - 0.75 * U, ay + 0.24 * U, 0.45 * U * rank, 0.16 * U, p.ink(0.85));

  const pop = eout(seg(q, 0.74, 0.8));
  if (pop > 0) {
    const bw = 2.7 * U * pop, bh = 0.8 * U * pop, bx = sx + SW - 2.7 * U, by = sy - 1.05 * U;
    c.fillStyle = p.bg;
    rr(c, bx, by, bw, bh, 0.14 * U);
    c.fill();
    c.strokeStyle = p.ac(0.95);
    c.stroke();
    if (pop > 0.9) {
      const k = bx + 0.38 * U, m = by + bh / 2, s = 0.2 * U * (1 + 0.15 * Math.sin(t * 6));
      c.beginPath();
      c.moveTo(k, m - s);
      c.quadraticCurveTo(k, m, k + s, m);
      c.quadraticCurveTo(k, m, k, m + s);
      c.quadraticCurveTo(k, m, k - s, m);
      c.quadraticCurveTo(k, m, k, m - s);
      c.fillStyle = p.ac(0.95);
      c.fill();
      bar(c, bx + 0.7 * U, by + 0.26 * U, 1.7 * U, 0.08 * U, p.fg(0.8));
      bar(c, bx + 0.7 * U, by + 0.44 * U, 1.1 * U, 0.06 * U, p.fg(0.35));
    }
  }
  c.globalAlpha = 1;
};

/* ───────────────────────── Ads management ──────────────────────────────
   A target: the audience drifts in orbit, the qualified dots spiral into
   the centre and pulse it, a dashed ring sweeps round. */
const ads: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  c.lineWidth = lw;
  const R = [2.5, 1.65, 0.8].map((r) => r * U);
  [0.5, 0.4, 0.6].forEach((a, i) => {
    c.strokeStyle = p.fg(a);
    c.beginPath();
    c.arc(cx, cy, R[i], 0, TAU);
    c.stroke();
  });
  c.strokeStyle = p.fg(0.25);
  c.beginPath();
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    c.moveTo(cx + dx * 0.25 * U, cy + dy * 0.25 * U);
    c.lineTo(cx + dx * 3.3 * U, cy + dy * 3.3 * U);
  }
  c.stroke();
  c.save();
  c.setLineDash([0.14 * U, 0.2 * U]);
  c.lineDashOffset = -t * U * 0.5;
  c.strokeStyle = p.fg(0.55);
  c.beginPath();
  c.arc(cx, cy, 2.95 * U, 0, TAU);
  c.stroke();
  c.restore();
  const sweep = (t * 0.9) % TAU;
  c.strokeStyle = p.ac(0.9);
  c.lineWidth = lw * 2;
  c.beginPath();
  c.arc(cx, cy, 2.95 * U, sweep, sweep + 0.5);
  c.stroke();
  c.lineWidth = lw;

  for (let i = 0; i < 30; i++) {
    const a0 = rnd(i) * TAU, P = 3 + rnd(i + 7) * 2.5;
    const e = ((t + rnd(i + 3) * P) % P) / P;
    if (rnd(i + 11) < 0.4) {
      const r = lerp(4.4 * U, 0, eio(e));
      const a = a0 + e * 1.4;
      dot(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.92, 0.07 * U, p.ac(0.95 * Math.min(1, e * 5)));
    } else {
      const r = (1.2 + rnd(i + 5) * 2.6) * U;
      const a = a0 + t * (0.15 + rnd(i + 2) * 0.2);
      dot(c, cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.92, 0.05 * U, p.fg(0.45));
    }
  }
  const pr = (t % 0.9) / 0.9;
  c.strokeStyle = p.ac(0.8 * (1 - pr));
  c.beginPath();
  c.arc(cx, cy, (0.2 + pr * 0.9) * U, 0, TAU);
  c.stroke();
  dot(c, cx, cy, 0.18 * U, p.ac(0.95));

  const kx = cx + 2.3 * U, ky = cy - 3.15 * U;
  c.fillStyle = p.bg;
  rr(c, kx, ky, 1.9 * U, 0.6 * U, 0.1 * U);
  c.fill();
  c.strokeStyle = p.fg(0.5);
  c.stroke();
  c.strokeStyle = p.ac(0.95);
  c.beginPath();
  c.moveTo(kx + 0.25 * U, ky + 0.42 * U);
  c.lineTo(kx + 0.42 * U, ky + 0.22 * U);
  c.lineTo(kx + 0.59 * U, ky + 0.42 * U);
  c.stroke();
  bar(c, kx + 0.8 * U, ky + 0.26 * U, (0.5 + 0.45 * ((t * 0.2) % 1)) * U, 0.09 * U, p.fg(0.85));
};

/* ───────────────────────── Content creation ────────────────────────────
   A page writes itself line by line behind a caret; an image card drops in
   halfway; then the page lifts away for the next one. */
const content: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  c.lineWidth = lw;
  const q = (t % 8) / 8;
  const enter = eout(seg(q, 0, 0.06)), exit = eio(seg(q, 0.9, 1));
  const PW = 4.6 * U, PH = 6.0 * U, px = cx - PW / 2 - 0.9 * U, py = cy - PH / 2 + (1 - enter) * 0.6 * U - exit * 0.6 * U;
  c.globalAlpha = enter * (1 - exit);
  const f = 0.5 * U;
  c.fillStyle = p.bg;
  c.beginPath();
  c.moveTo(px, py);
  c.lineTo(px + PW - f, py);
  c.lineTo(px + PW, py + f);
  c.lineTo(px + PW, py + PH);
  c.lineTo(px, py + PH);
  c.closePath();
  c.fill();
  c.strokeStyle = p.fg(0.85);
  c.stroke();
  c.strokeStyle = p.fg(0.45);
  c.beginPath();
  c.moveTo(px + PW - f, py);
  c.lineTo(px + PW - f, py + f);
  c.lineTo(px + PW, py + f);
  c.stroke();

  const lx = px + 0.45 * U;
  bar(c, lx, py + 0.6 * U, 2.8 * U * eio(seg(q, 0.06, 0.16)), 0.28 * U, p.fg(0.92));
  const L = Array.from({ length: 11 }, (_, k) => (k % 5 === 4 ? 1.6 : 3.7 - rnd(k) * 0.7) * U);
  const total = L.reduce((a, b) => a + b, 0);
  const writ = seg(q, 0.17, 0.8) * total;
  let acc = 0, caret: [number, number] | null = null;
  L.forEach((len, k) => {
    const y = py + 1.25 * U + k * 0.38 * U + (k > 4 ? 0.3 * U : 0);
    const d = clamp(writ - acc, 0, len);
    bar(c, lx, y, d, 0.09 * U, p.fg(k % 5 === 0 ? 0.6 : 0.4));
    if (d > 0 && d < len) caret = [lx + d, y];
    acc += len;
  });
  if (!caret && writ >= total) caret = [lx + L[10], py + 1.25 * U + 10 * 0.38 * U + 0.3 * U];
  if (caret && (writ < total || Math.floor(t * 2.4) % 2 === 0)) bar(c, caret[0] + 0.05 * U, caret[1] - 0.1 * U, 0.05 * U, 0.3 * U, p.ac(0.95));

  const ie = eout(seg(q, 0.45, 0.53));
  if (ie > 0) {
    const iw = 2.3 * U, ih = 1.75 * U, ix = px + PW + 0.35 * U, iy = cy - 1.7 * U + (1 - ie) * 0.4 * U;
    c.globalAlpha = enter * (1 - exit) * ie;
    c.fillStyle = p.bg;
    c.fillRect(ix, iy, iw, ih);
    c.strokeStyle = p.fg(0.7);
    c.strokeRect(ix, iy, iw, ih);
    mountain(c, ix + 0.2 * U, iy + 0.25 * U, iw - 0.4 * U, ih - 0.45 * U, U, p.fg(0.45));
    bar(c, ix, iy + ih + 0.2 * U, 1.6 * U, 0.08 * U, p.fg(0.5));
    c.fillStyle = p.ac(0.95);
    c.fillRect(ix + iw - 0.5 * U, iy - 0.18 * U, 0.68 * U, 0.36 * U);
  }
  c.globalAlpha = 1;
};

/* ───────────────────────── Photography & videography ───────────────────
   An aperture breathes open and shut inside a viewfinder; REC blinks and
   a focus box hunts, then locks. */
const photo: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  c.lineWidth = lw;
  const R = 2.35 * U;
  const tri = Math.abs(((t / 5) % 1) * 2 - 1);
  const open = eio(tri);
  const r = lerp(0.35 * U, 1.9 * U, open);
  const n = 7, rot = open * 0.7 + t * 0.05;
  const v = Array.from({ length: n }, (_, i) => {
    const a = rot + (i * TAU) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as [number, number];
  });
  c.beginPath();
  c.arc(cx, cy, R, 0, TAU);
  c.moveTo(v[0][0], v[0][1]);
  v.slice(1).forEach(([x, y]) => c.lineTo(x, y));
  c.closePath();
  c.fillStyle = p.fg(0.07);
  c.fill("evenodd");
  c.strokeStyle = p.fg(0.55);
  v.forEach(([x, y], i) => {
    const [nx, ny] = v[(i + 1) % n];
    const dl = Math.hypot(nx - x, ny - y) || 1, dx = (nx - x) / dl, dy = (ny - y) / dl;
    const ox = x - cx, oy = y - cy, b = ox * dx + oy * dy;
    const s = -b + Math.sqrt(Math.max(0, b * b - (ox * ox + oy * oy - R * R)));
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + dx * s, y + dy * s);
    c.stroke();
  });
  c.lineWidth = lw * 1.4;
  c.strokeStyle = p.fg(0.85);
  c.beginPath();
  c.arc(cx, cy, R, 0, TAU);
  c.stroke();
  c.lineWidth = lw;
  c.strokeStyle = p.fg(0.22);
  c.beginPath();
  c.arc(cx, cy, R * 1.13, 0, TAU);
  c.stroke();

  const vx = 3.7 * U, vy = 2.75 * U, b = 0.5 * U;
  c.strokeStyle = p.fg(0.8);
  c.beginPath();
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = cx + sx * vx, y = cy + sy * vy;
    c.moveTo(x - sx * b, y);
    c.lineTo(x, y);
    c.lineTo(x, y - sy * b);
  }
  c.stroke();
  if (Math.floor(t * 1.4) % 2 === 0) dot(c, cx - vx + 0.4 * U, cy - vy + 0.4 * U, 0.1 * U, p.ac(0.95));
  bar(c, cx - vx + 0.62 * U, cy - vy + 0.35 * U, 0.55 * U, 0.1 * U, p.fg(0.75));
  const fr = Math.floor(t * 24) % 24;
  for (let i = 0; i < 4; i++) bar(c, cx + vx - 2.0 * U + i * 0.42 * U, cy - vy + 0.35 * U, i === 3 ? 0.06 * U + (fr / 24) * 0.26 * U : 0.32 * U, 0.1 * U, p.fg(0.6));

  const k = t / 2.5, i0 = Math.floor(k), f = eio(clamp((k % 1) * 2.5));
  const fx = (i: number) => cx + (rnd(i) - 0.5) * 2.2 * U, fy = (i: number) => cy + (rnd(i + 30) - 0.5) * 1.6 * U;
  const x = lerp(fx(i0 - 1), fx(i0), f), y = lerp(fy(i0 - 1), fy(i0), f), s = 0.42 * U * (1 + (1 - f) * 0.4);
  c.strokeStyle = f >= 1 ? p.ac(0.95) : p.fg(0.8);
  c.beginPath();
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const ex = x + sx * s, ey = y + sy * s;
    c.moveTo(ex - sx * s * 0.45, ey);
    c.lineTo(ex, ey);
    c.lineTo(ex, ey - sy * s * 0.45);
  }
  c.stroke();

  const ly = cy + vy - 0.45 * U;
  c.strokeStyle = p.fg(0.35);
  c.beginPath();
  for (let i = 0; i <= 8; i++) {
    const x2 = cx - 2 * U + i * 0.5 * U;
    c.moveTo(x2, ly);
    c.lineTo(x2, ly - (i % 4 === 0 ? 0.22 : 0.12) * U);
  }
  c.moveTo(cx - 2 * U, ly);
  c.lineTo(cx + 2 * U, ly);
  c.stroke();
  const ix = cx - 2 * U + open * 4 * U;
  c.beginPath();
  c.moveTo(ix, ly + 0.08 * U);
  c.lineTo(ix - 0.12 * U, ly + 0.28 * U);
  c.lineTo(ix + 0.12 * U, ly + 0.28 * U);
  c.closePath();
  c.fillStyle = p.ac(0.95);
  c.fill();
};

/* ───────────────────────── Design & branding ───────────────────────────
   One outline morphs circle → square → triangle → hexagon on a
   construction grid, with bézier handles riding it and a swatch row below. */
function polyR(n: number, apo: number, a: number, a0: number) {
  const k = TAU / n;
  const m = (((a - a0) % k) + k) % k;
  return apo / Math.cos(m - k / 2);
}

const design: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  c.lineWidth = lw;
  const R = 2.15 * U;
  c.strokeStyle = p.fg(0.12);
  c.beginPath();
  c.moveTo(0, cy);
  c.lineTo(w, cy);
  c.moveTo(cx, 0);
  c.lineTo(cx, h);
  for (const d of [-R, R]) {
    c.moveTo(0, cy + d);
    c.lineTo(w, cy + d);
    c.moveTo(cx + d, 0);
    c.lineTo(cx + d, h);
  }
  c.stroke();
  c.save();
  c.setLineDash([0.1 * U, 0.12 * U]);
  c.strokeStyle = p.fg(0.25);
  c.beginPath();
  c.arc(cx, cy, R * 1.25, 0, TAU);
  c.stroke();
  c.restore();

  const shapes: ((a: number) => number)[] = [
    () => R,
    (a) => polyR(4, R * 0.82, a, Math.PI / 4),
    (a) => polyR(3, R * 0.6, a, -Math.PI / 2),
    (a) => polyR(6, R * 0.88, a, 0),
  ];
  const P = 1.9, k = t / P, i0 = Math.floor(k) % shapes.length, i1 = (i0 + 1) % shapes.length;
  const m = eio(seg(k % 1, 0.45, 1));
  const rad = (a: number) => lerp(shapes[i0](a), shapes[i1](a), m);
  const spin = t * 0.15;
  c.beginPath();
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * TAU;
    const rr2 = rad(a);
    const x = cx + rr2 * Math.cos(a + spin), y = cy + rr2 * Math.sin(a + spin);
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.closePath();
  c.fillStyle = p.fg(0.05);
  c.fill();
  c.lineWidth = lw * 1.5;
  c.strokeStyle = p.fg(0.95);
  c.stroke();
  c.lineWidth = lw;

  for (let i = 0; i < 4; i++) {
    const a = (i * TAU) / 4 + 0.4;
    const r1 = rad(a), x = cx + r1 * Math.cos(a + spin), y = cy + r1 * Math.sin(a + spin);
    const r2 = rad(a + 0.01), x2 = cx + r2 * Math.cos(a + 0.01 + spin), y2 = cy + r2 * Math.sin(a + 0.01 + spin);
    const dl = Math.hypot(x2 - x, y2 - y) || 1, tx = (x2 - x) / dl, ty = (y2 - y) / dl, hl = 0.75 * U;
    const sel = i === Math.floor(t / 1.2) % 4;
    c.strokeStyle = sel ? p.ac(0.9) : p.fg(0.45);
    c.beginPath();
    c.moveTo(x - tx * hl, y - ty * hl);
    c.lineTo(x + tx * hl, y + ty * hl);
    c.stroke();
    dot(c, x - tx * hl, y - ty * hl, 0.06 * U, sel ? p.ac(0.95) : p.fg(0.6));
    dot(c, x + tx * hl, y + ty * hl, 0.06 * U, sel ? p.ac(0.95) : p.fg(0.6));
    c.fillStyle = sel ? p.ac(0.95) : p.bg;
    c.fillRect(x - 0.09 * U, y - 0.09 * U, 0.18 * U, 0.18 * U);
    c.strokeStyle = sel ? p.ac(0.95) : p.fg(0.9);
    c.strokeRect(x - 0.09 * U, y - 0.09 * U, 0.18 * U, 0.18 * U);
  }

  const sw = 0.46 * U, sg = 0.2 * U, total = 5 * sw + 4 * sg, sy = cy + 3.05 * U;
  const pick = Math.floor(t / 1.7) % 5;
  [0.9, 0.55, 0.25, 0.1].forEach((a, i) => {
    c.fillStyle = p.fg(a);
    c.fillRect(cx - total / 2 + (i + 1) * (sw + sg), sy, sw, sw);
  });
  c.fillStyle = p.ac(0.95);
  c.fillRect(cx - total / 2, sy, sw, sw);
  c.strokeStyle = p.fg(0.9);
  c.strokeRect(cx - total / 2 + pick * (sw + sg) - 0.08 * U, sy - 0.08 * U, sw + 0.16 * U, sw + 0.16 * U);
};

/* ───────────────────────── Growth & analytics ──────────────────────────
   A chart frame: bars rise, a trend line draws itself with a glowing head,
   and the KPI card's figure climbs with it. */
const growth: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  c.lineWidth = lw;
  const q = (t % 7) / 7;
  const fade = 1 - seg(q, 0.9, 1);
  const W = 7.4 * U, H = 4.6 * U, x0 = cx - W / 2, y0 = cy - H / 2;
  c.strokeStyle = p.fg(0.1);
  c.beginPath();
  for (let i = 1; i <= 4; i++) {
    c.moveTo(x0, y0 + (H * i) / 5);
    c.lineTo(x0 + W, y0 + (H * i) / 5);
  }
  c.stroke();
  c.strokeStyle = p.fg(0.6);
  c.beginPath();
  c.moveTo(x0, y0);
  c.lineTo(x0, y0 + H);
  c.lineTo(x0 + W, y0 + H);
  c.stroke();
  for (let i = 0; i <= 4; i++) bar(c, x0 - 0.42 * U, y0 + (H * i) / 5 - 0.03 * U, 0.26 * U, 0.06 * U, p.fg(0.3));

  const n = 24;
  const val = (k: number) => clamp(0.1 + 0.72 * Math.pow(k / (n - 1), 1.35) + (rnd(k) - 0.5) * 0.1, 0.04, 0.95);
  const ptX = (k: number) => x0 + 0.3 * U + ((W - 0.6 * U) * k) / (n - 1);
  const ptY = (v: number) => y0 + H - v * H;
  c.globalAlpha = fade;
  for (let b = 0; b < 12; b++) {
    const e = eout(seg(q, 0.03 + b * 0.02, 0.15 + b * 0.02));
    const v = val(b * 2) * 0.42 * e;
    bar(c, ptX(b * 2) - 0.14 * U, ptY(v), 0.28 * U, v * H, p.fg(0.13));
  }
  const e = eio(seg(q, 0.08, 0.72)) * (n - 1);
  const last = Math.floor(e), frac = e - last;
  const pts: [number, number][] = [];
  for (let k = 0; k <= last; k++) pts.push([ptX(k), ptY(val(k))]);
  if (last < n - 1) pts.push([lerp(ptX(last), ptX(last + 1), frac), lerp(ptY(val(last)), ptY(val(last + 1)), frac)]);
  if (pts.length > 1) {
    const grad = c.createLinearGradient(0, y0, 0, y0 + H);
    grad.addColorStop(0, p.ac(0.28));
    grad.addColorStop(1, p.ac(0));
    c.beginPath();
    c.moveTo(pts[0][0], y0 + H);
    pts.forEach(([x, y]) => c.lineTo(x, y));
    c.lineTo(pts[pts.length - 1][0], y0 + H);
    c.closePath();
    c.fillStyle = grad;
    c.fill();
    polyline(c, pts);
    c.strokeStyle = p.ac(0.95);
    c.lineWidth = lw * 1.8;
    c.stroke();
    c.lineWidth = lw;
    const [hx, hy] = pts[pts.length - 1];
    dot(c, hx, hy, 0.1 * U, p.ac(1));
    const pr = (t % 1.2) / 1.2;
    c.strokeStyle = p.ac(0.7 * (1 - pr));
    c.beginPath();
    c.arc(hx, hy, (0.12 + pr * 0.45) * U, 0, TAU);
    c.stroke();
  }
  const kx = x0 + 0.35 * U, ky = y0 + 0.3 * U;
  c.fillStyle = p.bg;
  rr(c, kx, ky, 2.1 * U, 0.85 * U, 0.1 * U);
  c.fill();
  c.strokeStyle = p.fg(0.45);
  c.stroke();
  c.strokeStyle = p.ac(0.95);
  c.beginPath();
  c.moveTo(kx + 0.25 * U, ky + 0.58 * U);
  c.lineTo(kx + 0.45 * U, ky + 0.3 * U);
  c.lineTo(kx + 0.65 * U, ky + 0.58 * U);
  c.moveTo(kx + 0.45 * U, ky + 0.3 * U);
  c.lineTo(kx + 0.45 * U, ky + 0.66 * U);
  c.stroke();
  bar(c, kx + 0.88 * U, ky + 0.24 * U, (0.35 + 0.75 * (e / (n - 1))) * U, 0.14 * U, p.fg(0.9));
  bar(c, kx + 0.88 * U, ky + 0.52 * U, 0.7 * U, 0.06 * U, p.fg(0.35));
  c.globalAlpha = 1;
};

/* ───────────────────────── Automation (RADcruiters) ────────────────────
   Eight steps in a snake, one form submission running the whole route:
   each step lights as the packet passes, then the run resets. */
const automation: Scene = (c, w, h, t, p) => {
  base(c, w, h, p);
  const { U, cx, cy, lw } = frame(w, h);
  c.lineWidth = lw;
  const q = (t % 9) / 9;
  const fade = 1 - seg(q, 0.92, 1);
  const xs = [-3.2, -1.07, 1.07, 3.2].map((x) => cx + x * U);
  const nodes: [number, number][] = [...xs.map((x) => [x, cy - 1.1 * U] as [number, number]), ...[...xs].reverse().map((x) => [x, cy + 1.1 * U] as [number, number])];
  const nw = 1.6 * U, nh = 0.78 * U;
  c.strokeStyle = p.fg(0.3);
  polyline(c, nodes);
  c.stroke();
  const e = seg(q, 0.04, 0.86) * (nodes.length - 1);
  const k = Math.floor(e), f = e - k;
  const move = eio(seg(f, 0.35, 1));
  const at: [number, number] = k >= nodes.length - 1 ? nodes[nodes.length - 1] : [lerp(nodes[k][0], nodes[k + 1][0], move), lerp(nodes[k][1], nodes[k + 1][1], move)];
  if (k < nodes.length - 1 && q < 0.86) {
    c.strokeStyle = p.ac(0.95);
    c.lineWidth = lw * 2;
    c.beginPath();
    c.moveTo(nodes[k][0], nodes[k][1]);
    c.lineTo(at[0], at[1]);
    c.stroke();
    c.lineWidth = lw;
  }
  nodes.forEach(([x, y], i) => {
    const lit = (i < k || (i === k && move < 1) || q >= 0.86) && q > 0.04;
    const a = lit ? fade : 0;
    c.fillStyle = p.bg;
    rr(c, x - nw / 2, y - nh / 2, nw, nh, 0.1 * U);
    c.fill();
    if (a > 0) {
      c.fillStyle = p.ac(0.92 * a);
      c.fill();
    }
    c.strokeStyle = p.fg(0.8);
    c.stroke();
    const on = a > 0.5;
    bar(c, x - nw / 2 + 0.16 * U, y - nh / 2 + 0.14 * U, 0.2 * U, 0.06 * U, on ? p.ink(0.6) : p.fg(0.35));
    bar(c, x - nw / 2 + 0.16 * U, y - 0.04 * U, nw * 0.6, 0.1 * U, on ? p.ink(0.9) : p.fg(0.85));
    bar(c, x - nw / 2 + 0.16 * U, y + 0.16 * U, nw * 0.38, 0.06 * U, on ? p.ink(0.55) : p.fg(0.3));
  });
  if (q < 0.86) dot(c, at[0], at[1], 0.11 * U, p.ac(1));
};

export const SCENES = {
  "website-development": website,
  "software-development": software,
  "mobile-apps": mobile,
  "social-media": social,
  "seo-aeo-geo": seo,
  "ads-management": ads,
  "content-creation": content,
  "photo-video": photo,
  "design-branding": design,
  "growth-analytics": growth,
  automation,
} satisfies Record<string, Scene>;

export type SceneId = keyof typeof SCENES;
