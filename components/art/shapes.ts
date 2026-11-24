/** Deterministic organic shapes, so the same tree is drawn the same way every time. */
export function rng(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Math.round(n * 10) / 10;

/** A scalloped, slightly irregular closed outline: tree crowns, bushes, clouds. */
export function scallop(cx: number, cy: number, rx: number, ry: number, n: number, depth = 0.22, seed = 1, flatBottom = false) {
  const r = rng(seed);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + (r() - 0.5) * 0.25 - Math.PI / 2;
    const k = 1 + (r() - 0.5) * 0.14;
    let y = cy + ry * k * Math.sin(a);
    if (flatBottom && y > cy + ry * 0.55) y = cy + ry * 0.55 + (y - cy - ry * 0.55) * 0.2;
    pts.push([cx + rx * k * Math.cos(a), y]);
  }
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    const dx = mx - cx, dy = my - cy, len = Math.hypot(dx, dy) || 1;
    const push = depth * ((rx + ry) / 2) * (0.6 + r() * 0.7);
    d += ` Q${f(mx + (dx / len) * push)} ${f(my + (dy / len) * push)} ${f(q[0])} ${f(q[1])}`;
  }
  return d + 'Z';
}

/** Little leaf/foliage marks scattered inside a crown: the illustrator's texture. */
export function leafMarks(cx: number, cy: number, rx: number, ry: number, count: number, seed = 3, size = 7) {
  const r = rng(seed);
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2, k = Math.sqrt(r()) * 0.8;
    const x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k;
    const s = size * (0.7 + r() * 0.6);
    d += `M${f(x)} ${f(y)} q${f(s * 0.5)} ${f(-s * 0.6)} ${f(s)} 0 `;
  }
  return d;
}

/** A hand-ruled line: a straight run with a faint wander. */
export function ruled(x1: number, y1: number, x2: number, y2: number, seed = 1, wander = 1.6) {
  const r = rng(seed);
  const mx = (x1 + x2) / 2 + (r() - 0.5) * wander * 2, my = (y1 + y2) / 2 + (r() - 0.5) * wander * 2;
  return `M${f(x1)} ${f(y1)} Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}`;
}
