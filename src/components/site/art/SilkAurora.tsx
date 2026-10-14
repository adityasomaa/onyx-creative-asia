"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { ACCENT_EVENT } from "../Accent";

/**
 * Silk Aurora background (shader adapted from componentry.dev's
 * silk-aurora): flowing silk ribbons over a dark gradient, coloured from
 * the visitor's accent, so the default white reads as monochrome silver
 * silk and any other pick tints it. `seed` gives each instance its own
 * drift. Background only: no content, no overlays.
 *
 * Cheap on purpose: rendered at half resolution (the image is soft
 * anyway), the GL context is only created once the canvas is on screen,
 * drawing pauses when it leaves, and reduced motion gets one still frame.
 */

const VERTEX = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_seed;
uniform vec3 u_base;
uniform vec3 u_mid;
uniform vec3 u_sheen;
uniform vec3 u_accent;

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.93, 289.17))) * 43758.5453123); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, amp = 0.5;
  mat2 rot = mat2(0.82, 0.57, -0.57, 0.82);
  for (int i = 0; i < 5; i++) { v += amp * noise(p); p = rot * p * 2.03; amp *= 0.5; }
  return v;
}
float ribbon(vec2 p, float offset, float width, float softness) {
  float y = p.y + sin(p.x * 1.8 + offset) * 0.18;
  y += sin(p.x * 4.2 - offset * 0.7) * 0.045;
  return smoothstep(width + softness, width, abs(y));
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 mouse = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.12 + u_seed * 3.7;
  float near = smoothstep(0.72, 0.0, length(p - mouse));
  p += (mouse - p) * near * 0.05;
  p += vec2(sin(u_seed * 1.3), cos(u_seed * 0.9)) * 0.08;

  vec2 silk = p;
  silk.x += fbm(p * 1.6 + vec2(t * 0.8, -t * 0.35)) * 0.16;
  silk.y += fbm(p * 2.2 + vec2(-t * 0.25, t * 0.7)) * 0.10;
  float veilA = ribbon(silk + vec2(-0.18, 0.08), t * 2.1, 0.055, 0.22);
  float veilB = ribbon(silk * vec2(0.86, 1.18) + vec2(0.2, -0.14), -t * 2.8 + 1.7, 0.038, 0.18);
  float veilC = ribbon(silk * vec2(1.18, 0.9) + vec2(-0.08, 0.24), t * 1.4 - 2.1, 0.03, 0.16);
  float atmosphere = fbm(p * 1.35 + vec2(t * 0.22, -t * 0.1));
  float pearl = pow(max(0.0, sin((p.x - p.y) * 7.5 + atmosphere * 4.0 - t * 2.5)), 5.0);

  vec3 col = u_base;
  col = mix(col, u_mid, smoothstep(-0.45, 0.75, p.y + atmosphere * 0.75));
  col += u_accent * veilA * 0.40;
  col += u_sheen * veilB * 0.32;
  col += mix(u_sheen, u_accent, 0.35) * veilC * 0.22;
  col += u_sheen * pearl * 0.05;
  col += u_sheen * near * 0.05;
  float vignette = smoothstep(1.25, 0.22, length(p));
  col *= mix(0.55, 1.0, vignette);
  // Soft shoulder: a white accent stays silver instead of blowing out,
  // and line art drawn over it stays readable.
  col = 1.0 - exp(-col * 1.3);
  col += (hash(gl_FragCoord.xy + t * 90.0) - 0.5) * 0.045;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, k: number): RGB => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

/** The four shader colours from the accent: dark base, a tinted mid, a light sheen, the accent. */
function colours(): { base: RGB; mid: RGB; sheen: RGB; accent: RGB } {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "255 255 255";
  const accent = raw.split(/\s+/).map((v) => +v / 255) as RGB;
  const base: RGB = [0.035, 0.035, 0.04];
  return { base, mid: mix(base, accent, 0.14), sheen: mix(accent, [1, 1, 1], 0.45), accent };
}

export default function SilkAurora({ seed = 0, className }: { seed?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gl: WebGLRenderingContext | null = null;
    let u: Record<string, WebGLUniformLocation | null> = {};
    let raf = 0;
    let visible = false;
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const t0 = performance.now();

    const setColours = () => {
      if (!gl) return;
      const c = colours();
      gl.uniform3f(u.base, ...c.base);
      gl.uniform3f(u.mid, ...c.mid);
      gl.uniform3f(u.sheen, ...c.sheen);
      gl.uniform3f(u.accent, ...c.accent);
    };

    const init = () => {
      gl = cv.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
      if (!gl) return setFailed(true);
      const compile = (type: number, src: string) => {
        const s = gl!.createShader(type)!;
        gl!.shaderSource(s, src);
        gl!.compileShader(s);
        return gl!.getShaderParameter(s, gl!.COMPILE_STATUS) ? s : null;
      };
      const vs = compile(gl.VERTEX_SHADER, VERTEX);
      const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
      const prog = gl.createProgram();
      if (!vs || !fs || !prog) return setFailed(true);
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return setFailed(true);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const pos = gl.getAttribLocation(prog, "position");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
      for (const n of ["res", "mouse", "time", "seed", "base", "mid", "sheen", "accent"]) u[n] = gl.getUniformLocation(prog, `u_${n}`);
      gl.uniform1f(u.seed, seed);
      setColours();
    };

    const size = () => {
      if (!gl) return;
      // Half resolution, whatever the screen: the silk is soft by nature.
      const r = cv.getBoundingClientRect();
      const W = Math.max(1, Math.round(r.width * 0.5));
      const H = Math.max(1, Math.round(r.height * 0.5));
      if (cv.width !== W || cv.height !== H) {
        cv.width = W;
        cv.height = H;
        gl.viewport(0, 0, W, H);
      }
      gl.uniform2f(u.res, W, H);
    };

    const draw = (now: number) => {
      if (!gl || !visible) return;
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      gl.uniform2f(u.mouse, mouse.x, mouse.y);
      gl.uniform1f(u.time, reduce ? 8 : (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return;
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (!visible) return;
      if (!gl) init();
      size();
      raf = requestAnimationFrame(draw);
    });
    const ro = new ResizeObserver(() => {
      size();
      if (reduce && visible) raf = requestAnimationFrame(draw);
    });
    io.observe(cv);
    ro.observe(cv);
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
    // Recolour the moment the palette changes (a still frame redraws too).
    const onAccent = () => {
      setColours();
      if (reduce && visible) raf = requestAnimationFrame(draw);
    };
    window.addEventListener(ACCENT_EVENT, onAccent);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(ACCENT_EVENT, onAccent);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [seed]);

  if (failed) {
    return (
      <div
        aria-hidden
        className={cn("block", className)}
        style={{ background: "radial-gradient(120% 80% at 30% 40%, rgb(var(--accent) / 0.22), transparent 60%), #0a0a0b" }}
      />
    );
  }
  return <canvas ref={ref} aria-hidden className={cn("block", className)} />;
}
