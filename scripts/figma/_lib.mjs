/**
 * Shared helpers for Figma drift-detection scripts.
 * Loads env, fetches Figma REST API, hashes a component's variable surface.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const repoRoot = resolve(__dirname, '..', '..');

export const MANIFEST_PATH  = resolve(repoRoot, '.figma', 'manifest.json');
export const SNAPSHOT_PATH  = resolve(repoRoot, '.figma', 'snapshots.json');
export const STATE_DIR      = resolve(repoRoot, '.figma', 'state');
export const VARIABLES_DIR  = resolve(repoRoot, '.figma', 'variables');
// Legacy single-file path — checked as fallback if variables/ dir doesn't exist
export const VARIABLES_PATH = resolve(repoRoot, '.figma', 'variables.json');

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

export async function figmaFetch(env, path, opts = {}) {
  const maxRetries = opts.maxRetries ?? 3;
  let attempt = 0;
  while (true) {
    const res = await fetch(`https://api.figma.com${path}`, {
      headers: { 'X-Figma-Token': env.FIGMA_PAT },
    });
    // 429 = rate limit. Respect Retry-After header if Figma sends one,
    // otherwise exponential backoff capped at 30s.
    if (res.status === 429 && attempt < maxRetries) {
      const retryAfter = parseInt(res.headers.get('Retry-After') || '0', 10);
      const waitMs = retryAfter > 0
        ? retryAfter * 1000
        : Math.min(2000 * Math.pow(2, attempt), 30_000);
      await new Promise((r) => setTimeout(r, waitMs));
      attempt++;
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Figma API ${res.status} ${res.statusText} for ${path}\n${body}`);
    }
    return res.json();
  }
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
 * Bulk version — fetch many node subtrees in a SINGLE Figma API call.
 * Figma's /nodes endpoint accepts comma-separated ids, returns all in one
 * response. Massive rate-limit win: N components → 1 call (vs N calls).
 *
 * Chunks at 50 ids per request as safety margin (URL length + cost units).
 * Returns Map<nodeId, { hash, varCount, canonical, subtree } | { error }>.
 */
export async function hashComponentsBulk(env, nodeIds) {
  const result = new Map();
  const CHUNK_SIZE = 50;
  const chunks = [];
  for (let i = 0; i < nodeIds.length; i += CHUNK_SIZE) {
    chunks.push(nodeIds.slice(i, i + CHUNK_SIZE));
  }

  for (const chunk of chunks) {
    const ids = chunk.join(',');
    let nodesRes;
    try {
      nodesRes = await figmaFetch(
        env,
        `/v1/files/${env.FIGMA_FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}`,
      );
    } catch (err) {
      // Whole chunk failed (e.g. 429 after retries exhausted). Mark every
      // node in this chunk as errored — partial result is better than total.
      for (const nodeId of chunk) {
        result.set(nodeId, { error: err.message });
      }
      continue;
    }
    for (const nodeId of chunk) {
      const subtree = nodesRes.nodes[nodeId]?.document;
      if (!subtree) {
        result.set(nodeId, { error: `Node ${nodeId} not found in file ${env.FIGMA_FILE_KEY}` });
        continue;
      }
      const varIds = new Set();
      walkBoundVariables(subtree, varIds);
      const canonical = canonicalize(subtree);
      const hash = createHash('sha256').update(canonical).digest('hex');
      result.set(nodeId, { hash, varCount: varIds.size, canonical, subtree });
    }
  }
  return result;
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
    bindings: simplifyBindings(node.boundVariables),
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
  }));
}

function simplifyBindings(boundVariables) {
  if (!boundVariables || typeof boundVariables !== 'object') return undefined;
  const result = {};
  for (const [key, value] of Object.entries(boundVariables)) {
    if (Array.isArray(value)) {
      result[key] = value.map((v) => v?.id?.replace(/^VariableID:/, '') || null);
    } else if (value && typeof value === 'object' && value.id) {
      result[key] = value.id.replace(/^VariableID:/, '');
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
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

  // Either side is an array → element-wise (treat non-array as empty array).
  // This handles new fills[] appearing where old had nothing — we recurse
  // into the new element instead of dumping the whole object as a leaf.
  if (Array.isArray(a) || Array.isArray(b)) {
    const aArr = Array.isArray(a) ? a : [];
    const bArr = Array.isArray(b) ? b : [];
    const len = Math.max(aArr.length, bArr.length);
    for (let i = 0; i < len; i++) {
      const av = aArr[i];
      const bv = bArr[i];
      const path = `${prefix}[${i}]`;
      if (JSON.stringify(av) === JSON.stringify(bv)) continue;
      const aIsObj = av && typeof av === 'object';
      const bIsObj = bv && typeof bv === 'object';
      if (aIsObj || bIsObj) {
        changes.push(...compareNode(av, bv, path));
      } else {
        changes.push({ path, before: av, after: bv });
      }
    }
    return changes;
  }

  // Object key-wise (treat non-object as empty object).
  const aObj = (a && typeof a === 'object') ? a : {};
  const bObj = (b && typeof b === 'object') ? b : {};
  const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
  for (const key of keys) {
    const path = prefix ? `${prefix}.${key}` : key;
    const av = aObj[key];
    const bv = bObj[key];
    if (JSON.stringify(av) === JSON.stringify(bv)) continue;
    const aIsObj = av && typeof av === 'object';
    const bIsObj = bv && typeof bv === 'object';
    if (aIsObj || bIsObj) {
      changes.push(...compareNode(av, bv, path));
    } else {
      changes.push({ path, before: av, after: bv });
    }
  }
  return changes;
}

/**
 * Load variable dictionary — name→value mapping for diff enrichment.
 *
 * Reads from `.figma/variables/<slug>.json` (per-component files) and merges
 * all of them. Falls back to legacy `.figma/variables.json` single-file if dir
 * is empty/missing.
 *
 * Per-component split prevents foundation tokens (radius/shadow) from being
 * overwritten when /sync-figma button refreshes button-scoped variables.
 */
export function loadVariableDictionary() {
  const variables = {};

  // Try per-component dir first (preferred)
  let dirEntries = [];
  try {
    if (existsSync(VARIABLES_DIR)) {
      dirEntries = readdirSync(VARIABLES_DIR).filter((f) => f.endsWith('.json'));
    }
  } catch {
    /* empty */
  }

  if (dirEntries.length > 0) {
    for (const file of dirEntries) {
      try {
        const data = JSON.parse(readFileSync(resolve(VARIABLES_DIR, file), 'utf8'));
        Object.assign(variables, data.variables || {});
      } catch {
        /* skip malformed file */
      }
    }
  } else {
    // Fallback: legacy single file
    try {
      const data = JSON.parse(readFileSync(VARIABLES_PATH, 'utf8'));
      Object.assign(variables, data.variables || {});
    } catch {
      return {
        hasData: false,
        nameForValue: () => null,
        nameForBoundId: () => null,
      };
    }
  }

  if (Object.keys(variables).length === 0) {
    return {
      hasData: false,
      nameForValue: () => null,
      nameForBoundId: () => null,
    };
  }

  // Build value → [names] reverse index
  const byValue = new Map();
  for (const [name, value] of Object.entries(variables)) {
    if (typeof value !== 'string') continue;
    const norm = value.toLowerCase();
    if (!byValue.has(norm)) byValue.set(norm, []);
    byValue.get(norm).push(name);
  }

  // Pick best name candidate based on path heuristic
  function pickByPath(candidates, hint) {
    if (candidates.length === 0) return null;
    if (candidates.length === 1) return candidates[0];
    if (hint) {
      const filtered = candidates.filter((n) => n.includes(hint));
      if (filtered.length > 0) {
        // Shortest = least-suffixed = most "default"
        return filtered.sort((a, b) => a.length - b.length)[0];
      }
    }
    return candidates.sort((a, b) => a.length - b.length)[0];
  }

  return {
    hasData: true,
    /** Look up token name by resolved value (hex / number string). */
    nameForValue(value, hint) {
      if (value == null) return null;
      const v = String(value).toLowerCase();
      const cands = byValue.get(v);
      if (!cands) return null;
      return pickByPath(cands, hint);
    },
    /** Look up token name from a bound ID by going through state's resolved value. */
    nameForBoundId(_boundId, resolvedValue, hint) {
      // We don't have direct ID→name mapping (Pro tier limit). Fall back to value lookup.
      return this.nameForValue(resolvedValue, hint);
    },
  };
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
