// Uniform flow in a partially full circular culvert (Manning equation).
// Equations follow lmnoeng.com/CircularCulvert.php. All calculation is in SI, so k = 1.

export const G = 9.8066;
const TAU = 2 * Math.PI;

export type Goal = 'flow' | 'depth' | 'diameter' | 'slope' | 'roughness';
export type Known = 'Q' | 'V';
export type Measure = 'depth' | 'width';
export type Branch = 'lower' | 'upper';
export type FieldId = 'Q' | 'V' | 'd' | 'y' | 'T' | 'ratio' | 'n' | 'S';

export interface Inputs {
  goal: Goal;
  known: Known;
  measure: Measure;
  branch: Branch;
  values: Partial<Record<FieldId, number>>;
}

export interface Solution {
  Q: number;
  V: number;
  d: number;
  y: number;
  ratio: number;
  T: number;
  A: number;
  P: number;
  R: number;
  theta: number;
  F: number;
  n: number;
  S: number;
}

export type Failure =
  | { code: 'invalid' | 'nonpositive'; field: FieldId }
  | { code: 'ratio'; field: FieldId }
  | { code: 'width'; field: 'T' }
  | { code: 'capacity'; field: Known; max: number; atRatio: number };

export type Outcome = { ok: true; solutions: Solution[] } | ({ ok: false } & Failure);

// Per-unit-diameter section factors: A = area(θ)·d², R = radius(θ)·d.
const area = (t: number) => (t - Math.sin(t)) / 8;
const radius = (t: number) => (1 - Math.sin(t) / t) / 4;

/** Dimensionless Q and V shapes: Q = (√S/n)·d^(8/3)·qShape, V = (√S/n)·d^(2/3)·vShape. */
const vShape = (t: number) => Math.pow(radius(t), 2 / 3);
const qShape = (t: number) => area(t) * vShape(t);

function goldenMax(f: (t: number) => number, lo: number, hi: number) {
  const phi = (Math.sqrt(5) - 1) / 2;
  let a = lo;
  let b = hi;
  while (b - a > 1e-10) {
    const c = b - phi * (b - a);
    const d = a + phi * (b - a);
    if (f(c) > f(d)) b = d;
    else a = c;
  }
  return (a + b) / 2;
}

const thetaQmax = goldenMax(qShape, Math.PI, TAU);
const thetaVmax = goldenMax(vShape, Math.PI, TAU);

export const thetaFromRatio = (r: number) => 2 * Math.acos(1 - 2 * r);
export const ratioFromTheta = (t: number) => (1 - Math.cos(t / 2)) / 2;

/** Discharge and velocity at relative depth r, as fractions of the full-pipe values. */
export function relativeFlow(r: number) {
  const t = thetaFromRatio(r);
  return { q: qShape(t) / qShape(TAU), v: vShape(t) / vShape(TAU) };
}

export const peaks = {
  discharge: { ratio: ratioFromTheta(thetaQmax), value: qShape(thetaQmax) / qShape(TAU) },
  velocity: { ratio: ratioFromTheta(thetaVmax), value: vShape(thetaVmax) / vShape(TAU) },
};

function bisect(f: (t: number) => number, target: number, lo: number, hi: number) {
  const rising = f(hi) > f(lo);
  for (let i = 0; i < 200 && hi - lo > 1e-13; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < target === rising) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Every θ with shape(θ) = target. Flow peaks below full, so there can be two. */
function rootsOf(shape: (t: number) => number, peak: number, target: number) {
  if (target > shape(peak)) return [];
  const roots = [bisect(shape, target, 1e-9, peak)];
  if (target > shape(TAU)) roots.push(bisect(shape, target, peak, TAU));
  return roots;
}

function build(theta: number, d: number, n: number, S: number): Solution {
  const A = area(theta) * d * d;
  const R = radius(theta) * d;
  const P = (theta * d) / 2;
  const y = (d / 2) * (1 - Math.cos(theta / 2));
  const T = 2 * Math.sqrt(y * (d - y));
  const V = (1 / n) * Math.pow(R, 2 / 3) * Math.sqrt(S);
  const F = V * Math.sqrt(T / (G * A * Math.cos(Math.atan(S))));
  return { Q: V * A, V, d, y, ratio: y / d, T, A, P, R, theta, F, n, S };
}

/** Fields the user must supply for a given way of posing the problem. */
export function requiredFields(goal: Goal, known: Known, measure: Measure): FieldId[] {
  switch (goal) {
    case 'flow':
      return measure === 'depth' ? ['d', 'y', 'n', 'S'] : ['d', 'T', 'n', 'S'];
    case 'depth':
      return [known, 'd', 'n', 'S'];
    case 'diameter':
      return [known, 'ratio', 'n', 'S'];
    case 'slope':
      return [known, 'd', 'y', 'n'];
    case 'roughness':
      return [known, 'd', 'y', 'S'];
  }
}

export function solve(input: Inputs): Outcome {
  const { goal, known, measure, branch, values } = input;
  for (const field of requiredFields(goal, known, measure)) {
    const v = values[field];
    if (v === undefined || !Number.isFinite(v)) return { ok: false, code: 'invalid', field };
    if (v <= 0) return { ok: false, code: 'nonpositive', field };
  }
  const { d = NaN, y = NaN, T = NaN, ratio = NaN, n = NaN, S = NaN } = values;
  const target = known === 'Q' ? (values.Q as number) : (values.V as number);
  const shape = known === 'Q' ? qShape : vShape;
  const peak = known === 'Q' ? thetaQmax : thetaVmax;

  if (goal === 'flow' && measure === 'width') {
    if (T / d > 1) return { ok: false, code: 'width', field: 'T' };
    const half = 2 * Math.asin(T / d);
    return { ok: true, solutions: [build(branch === 'lower' ? half : TAU - half, d, n, S)] };
  }

  if (goal === 'depth') {
    const scale = (Math.sqrt(S) / n) * Math.pow(d, known === 'Q' ? 8 / 3 : 2 / 3);
    const roots = rootsOf(shape, peak, target / scale);
    if (!roots.length) {
      const atRatio = ratioFromTheta(peak);
      return { ok: false, code: 'capacity', field: known, max: scale * shape(peak), atRatio };
    }
    return { ok: true, solutions: roots.map((t) => build(t, d, n, S)) };
  }

  if (goal === 'diameter') {
    if (ratio >= 1) return { ok: false, code: 'ratio', field: 'ratio' };
    const t = thetaFromRatio(ratio);
    const exponent = known === 'Q' ? 3 / 8 : 3 / 2;
    const solved = Math.pow((target * n) / (shape(t) * Math.sqrt(S)), exponent);
    return { ok: true, solutions: [build(t, solved, n, S)] };
  }

  // The remaining goals all know the depth and diameter.
  if (y / d >= 1) return { ok: false, code: 'ratio', field: 'y' };
  const t = thetaFromRatio(y / d);
  if (goal === 'flow') return { ok: true, solutions: [build(t, d, n, S)] };

  const conveyance = shape(t) * Math.pow(d, known === 'Q' ? 8 / 3 : 2 / 3);
  if (goal === 'slope') {
    return { ok: true, solutions: [build(t, d, n, Math.pow((target * n) / conveyance, 2))] };
  }
  return { ok: true, solutions: [build(t, d, (conveyance * Math.sqrt(S)) / target, S)] };
}

// ---------------------------------------------------------------- units

export type Kind = 'flow' | 'velocity' | 'length' | 'area';

const FT = 0.3048;
const GAL = 3.785411784e-3;
const ACRE_FT = 1233.48183754752;

/** Multiply a value in the named unit by the factor to get SI. */
export const UNITS: Record<Kind, Record<string, number>> = {
  flow: {
    'm³/s': 1,
    'ft³/s': FT ** 3,
    'gal/min': GAL / 60,
    'gal/day': GAL / 86400,
    'acre-ft/yr': ACRE_FT / (365 * 86400),
  },
  velocity: { 'm/s': 1, 'ft/s': FT },
  length: { m: 1, cm: 0.01, ft: FT, in: FT / 12 },
  area: { 'm²': 1, 'ft²': FT ** 2 },
};

export const PRESETS: Record<'si' | 'us', Record<Kind, string>> = {
  si: { flow: 'm³/s', velocity: 'm/s', length: 'm', area: 'm²' },
  us: { flow: 'ft³/s', velocity: 'ft/s', length: 'ft', area: 'ft²' },
};

export function format(x: number, digits = 5) {
  if (!Number.isFinite(x)) return '—';
  return x.toLocaleString('en-US', { maximumSignificantDigits: digits });
}

// ---------------------------------------------------------------- reference data

export interface Material {
  group: 'Metals' | 'Non-metals';
  name: string;
  n: number;
  range?: string;
  refs?: string;
}

export const MATERIALS: Material[] = [
  { group: 'Metals', name: 'Brass', n: 0.011 },
  { group: 'Metals', name: 'Smooth steel', n: 0.012 },
  { group: 'Metals', name: 'Cast iron', n: 0.013 },
  { group: 'Metals', name: 'Corrugated metal', n: 0.022 },
  { group: 'Non-metals', name: 'Glass', n: 0.01 },
  { group: 'Non-metals', name: 'Finished concrete', n: 0.012 },
  { group: 'Non-metals', name: 'Unfinished concrete', n: 0.014 },
  { group: 'Non-metals', name: 'Clay tile', n: 0.014 },
  { group: 'Non-metals', name: 'Brickwork', n: 0.015 },
  { group: 'Non-metals', name: 'Asphalt', n: 0.016 },
  { group: 'Non-metals', name: 'Masonry', n: 0.025 },
  { group: 'Non-metals', name: 'Planed wood', n: 0.012 },
  { group: 'Non-metals', name: 'Unplaned wood', n: 0.013 },
  { group: 'Non-metals', name: 'Gravel', n: 0.029 },
  { group: 'Non-metals', name: 'Earth', n: 0.025 },
  { group: 'Non-metals', name: 'Corrugated PE, smooth inner walls', n: 0.012, range: '0.009–0.015', refs: 'a, b' },
  { group: 'Non-metals', name: 'Corrugated PE, corrugated inner walls', n: 0.0215, range: '0.018–0.025', refs: 'c' },
  { group: 'Non-metals', name: 'PVC, smooth inner walls', n: 0.01, range: '0.009–0.011', refs: 'd, e' },
];
