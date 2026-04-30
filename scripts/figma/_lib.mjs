/**
 * Shared helpers for Figma drift-detection scripts.
 * Loads env, fetches Figma REST API, hashes a component's variable surface.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const repoRoot = resolve(__dirname, '..', '..');

export const MANIFEST_PATH  = resolve(repoRoot, '.figma', 'manifest.json');
export const SNAPSHOT_PATH  = resolve(repoRoot, '.figma', 'snapshots.json');
export const STATE_DIR      = resolve(repoRoot, '.figma', 'state');

export function loadEnv() {
  const path = resolve(repoRoot, '.env.local');
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    throw new Error(`Missing ${path}. Copy .env.local.example and fill in FIGMA_PAT.`);
  }
  const env = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  if (!env.FIGMA_PAT) throw new Error('Missing FIGMA_PAT in .env.local');
  if (!env.FIGMA_FILE_KEY) throw new Error('Missing FIGMA_FILE_KEY in .env.local');
  return env;
}

export async function figmaFetch(env, path) {
  const res = await fetch(`https://api.figma.com${path}`, {
    headers: { 'X-Figma-Token': env.FIGMA_PAT },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status} ${res.statusText} for ${path}\n${body}`);
  }
  return res.json();
}

function walkBoundVariables(node, sink) {
  if (!node || typeof node !== 'object') return;
  if (node.boundVariables && typeof node.boundVariables === 'object') {
    for (const value of Object.values(node.boundVariables)) {
      const refs = Array.isArray(value) ? value : [value];
      for (const ref of refs) {
        if (ref && typeof ref === 'object' && typeof ref.id === 'string') {
          sink.add(ref.id);
        }
      }
    }
  }
  for (const child of node.children || []) walkBoundVariables(child, sink);
}

/**
 * Compute the structure hash for one component node.
 *
 * Strategy: fetch the Component Set's full subtree, deterministically
 * canonicalize the JSON (sorted keys, stripped volatile fields), SHA-256.
 *
 * Captures:
 *   - Layer add / remove / reorder
 *   - Variable BINDING changes (different variable ID bound to a property)
 *   - Inline value changes (any color/spacing/radius set directly, not via variable)
 *   - Variant property add/remove
 *
 * Misses (limitation of Pro-tier REST API — see .figma/README.md):
 *   - Pure variable VALUE changes when the binding ID stays the same
 *     (e.g. designer edits the value of `accent-default` token globally)
 *
 * To upgrade to full variable resolution, the file must be on Figma Enterprise
 * tier and the PAT must have the `file_variables:read` scope. Then swap the
 * implementation back to fetch /variables/local and hash the resolved values.
 */

// Volatile / noise fields that change without semantic meaning.
const VOLATILE_KEYS = new Set([
  'absoluteBoundingBox',
  'absoluteRenderBounds',
  'size',
  'relativeTransform',
]);

function canonicalize(value) {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map(canonicalize).join(',') + ']';
  }
  const keys = Object.keys(value).filter((k) => !VOLATILE_KEYS.has(k)).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalize(value[k])).join(',') + '}';
}

export async function hashComponent(env, nodeId) {
  const nodesRes = await figmaFetch(
    env,
    `/v1/files/${env.FIGMA_FILE_KEY}/nodes?ids=${encodeURIComponent(nodeId)}`,
  );
  const key = Object.keys(nodesRes.nodes)[0];
  const subtree = nodesRes.nodes[key]?.document;
  if (!subtree) throw new Error(`Node ${nodeId} not found in file ${env.FIGMA_FILE_KEY}`);

  const varIds = new Set();
  walkBoundVariables(subtree, varIds);

  const canonical = canonicalize(subtree);
  const hash = createHash('sha256').update(canonical).digest('hex');
  return { hash, varCount: varIds.size, canonical, subtree };
}

/**
 * Build a compact "fingerprint" of a Component Set's variants for diffing.
 * Output: { variants: { variantName: { props } }, structure: {...} }
 *
 * Each variant captures only the properties that meaningfully describe its
 * visual: fills, strokes, effects, padding, cornerRadius, layoutSizing,
 * variable bindings, and child layer count. Volatile fields are stripped.
 */
export function summarize(subtree) {
  const summary = {
    type: subtree.type,
    name: subtree.name,
    variants: {},
    nonVariantNodes: [],
  };

  if (subtree.type === 'COMPONENT_SET') {
    for (const variant of subtree.children || []) {
      summary.variants[variant.name] = nodeFingerprint(variant);
    }
  } else {
    summary.nonVariantNodes.push(nodeFingerprint(subtree));
  }

  return summary;
}

function nodeFingerprint(node) {
  return {
    type: node.type,
    fills: simplifyFills(node.fills),
    strokes: simplifyFills(node.strokes),
    strokeWeight: node.strokeWeight,
    cornerRadius: node.cornerRadius,
    rectangleCornerRadii: node.rectangleCornerRadii,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    itemSpacing: node.itemSpacing,
    layoutMode: node.layoutMode,
    primaryAxisAlignItems: node.primaryAxisAlignItems,
    counterAxisAlignItems: node.counterAxisAlignItems,
    effects: simplifyEffects(node.effects),
    boundVariables: node.boundVariables,
    childCount: (node.children || []).length,
    childNames: (node.children || []).map((c) => `${c.type}:${c.name}`),
  };
}

function simplifyFills(fills) {
  if (!fills || !Array.isArray(fills)) return undefined;
  return fills.map((f) => ({
    type: f.type,
    color: f.color
      ? `rgb(${Math.round((f.color.r || 0) * 255)}, ${Math.round((f.color.g || 0) * 255)}, ${Math.round((f.color.b || 0) * 255)}, a=${f.color.a ?? 1})`
      : undefined,
    opacity: f.opacity,
    visible: f.visible,
    boundVar: f.boundVariables?.color?.id,
  }));
}

function simplifyEffects(effects) {
  if (!effects || !Array.isArray(effects)) return undefined;
  return effects.map((e) => ({
    type: e.type,
    radius: e.radius,
    spread: e.spread,
    visible: e.visible,
    color: e.color
      ? `rgba(${Math.round((e.color.r || 0) * 255)},${Math.round((e.color.g || 0) * 255)},${Math.round((e.color.b || 0) * 255)},${e.color.a ?? 1})`
      : undefined,
  }));
}

/**
 * Compute a human-readable diff between two summaries (old → new).
 * Returns { added: [...], removed: [...], modified: [{ variant, changes: [...] }] }.
 */
export function diffSummaries(oldSum, newSum) {
  const out = { added: [], removed: [], modified: [] };
  const oldVariants = oldSum.variants || {};
  const newVariants = newSum.variants || {};

  for (const name of Object.keys(newVariants)) {
    if (!(name in oldVariants)) {
      out.added.push(name);
    } else {
      const changes = compareNode(oldVariants[name], newVariants[name]);
      if (changes.length > 0) out.modified.push({ variant: name, changes });
    }
  }
  for (const name of Object.keys(oldVariants)) {
    if (!(name in newVariants)) out.removed.push(name);
  }

  return out;
}

function compareNode(a, b, prefix = '') {
  const changes = [];
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  for (const key of keys) {
    const path = prefix ? `${prefix}.${key}` : key;
    const av = a?.[key];
    const bv = b?.[key];
    if (JSON.stringify(av) === JSON.stringify(bv)) continue;
    if (
      typeof av === 'object' && av !== null && !Array.isArray(av) &&
      typeof bv === 'object' && bv !== null && !Array.isArray(bv)
    ) {
      changes.push(...compareNode(av, bv, path));
    } else {
      changes.push({ path, before: av, after: bv });
    }
  }
  return changes;
}

export function loadState(slug) {
  try {
    const path = resolve(STATE_DIR, `${slug}.json`);
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

export function saveState(slug, summary) {
  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });
  const path = resolve(STATE_DIR, `${slug}.json`);
  writeFileSync(path, JSON.stringify(summary, null, 2) + '\n', 'utf8');
}

export function loadManifest() {
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
}

export function loadSnapshots() {
  try {
    return JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8'));
  } catch {
    return { version: 1, syncedAt: null, components: {} };
  }
}

export function saveSnapshots(snap) {
  writeFileSync(SNAPSHOT_PATH, JSON.stringify(snap, null, 2) + '\n', 'utf8');
}

export function figmaUrl(fileKey, nodeId, fileName = 'POD-Design-System') {
  const dashed = nodeId.replace(':', '-');
  const slug = encodeURIComponent(fileName.replace(/\s+/g, '-'));
  return `https://www.figma.com/design/${fileKey}/${slug}?node-id=${dashed}`;
}

export async function getFileName(env) {
  try {
    const res = await figmaFetch(env, `/v1/files/${env.FIGMA_FILE_KEY}?depth=1`);
    return res.name || 'POD-Design-System';
  } catch {
    return 'POD-Design-System';
  }
}

export function relativeTime(iso) {
  if (!iso) return 'never';
  const ms = Date.now() - new Date(iso).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
