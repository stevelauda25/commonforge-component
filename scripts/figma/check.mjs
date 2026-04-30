#!/usr/bin/env node
/**
 * Drift detection for Figma-tracked components.
 *
 *   node scripts/figma/check.mjs              → summary of ALL tracked components
 *   node scripts/figma/check.mjs button       → detailed diff for one component
 *   node scripts/figma/check.mjs btn cbx      → detailed diff for several
 *
 * Flags (work in either mode unless noted):
 *   --json         Structured JSON output (machine-readable). Always full detail.
 *   --slugs-only   Print drifted slugs (one per line). Summary mode only.
 *   --urls-only    Print Figma URLs (one per line). Summary mode only.
 *
 * Exit code: 0 = clean, 1 = drift detected (in scoped mode, only for given slugs).
 */

import {
  diffSummaries,
  figmaUrl,
  getFileName,
  hashComponent,
  loadEnv,
  loadManifest,
  loadSnapshots,
  loadState,
  relativeTime,
  summarize,
} from './_lib.mjs';

const rawArgs = process.argv.slice(2);
const flags = new Set(rawArgs.filter((a) => a.startsWith('--')));
const targets = rawArgs.filter((a) => !a.startsWith('--'));
const isDetail = targets.length > 0;

const jsonMode  = flags.has('--json');
const slugsOnly = flags.has('--slugs-only');
const urlsOnly  = flags.has('--urls-only');
const quietMode = jsonMode || slugsOnly || urlsOnly;

async function main() {
  const env = loadEnv();
  const manifest = loadManifest();
  const snapshots = loadSnapshots();
  env.FIGMA_FILE_KEY = manifest.fileKey;

  const fileName = await getFileName(env);

  // Validate target slugs early
  if (isDetail) {
    const known = new Set(manifest.components.map((c) => c.slug));
    const unknown = targets.filter((t) => !known.has(t));
    if (unknown.length > 0) {
      console.error(`Unknown slug(s): ${unknown.join(', ')}`);
      console.error(`Tracked: ${[...known].join(', ') || '(none)'}`);
      process.exit(2);
    }
  }

  if (!quietMode) {
    if (isDetail) {
      console.log(
        `🔍 ${targets.join(', ')} — checking against Figma file ${fileName} ` +
        `(${manifest.fileKey})…\n`,
      );
    } else {
      console.log(
        `🔍 Checking ${manifest.components.length} component(s) against ` +
        `Figma file ${fileName} (${manifest.fileKey})…\n`,
      );
    }
  }

  // Process every tracked component (so we have full data for diff & summary)
  const drifted = [];
  const inSync = [];
  const errors = [];

  for (const comp of manifest.components) {
    // In detail mode, only process targets to save API calls
    if (isDetail && !targets.includes(comp.slug)) continue;

    const snap = snapshots.components?.[comp.slug];
    let current;
    try {
      current = await hashComponent(env, comp.nodeId);
    } catch (err) {
      errors.push({ slug: comp.slug, message: err.message });
      continue;
    }

    const url = figmaUrl(manifest.fileKey, comp.nodeId, fileName);

    if (!snap) {
      drifted.push({
        slug: comp.slug,
        nodeId: comp.nodeId,
        url,
        reason: 'never blessed',
        lastSync: null,
        diff: null,
      });
      continue;
    }

    if (snap.hash !== current.hash) {
      const oldState = loadState(comp.slug);
      const newSummary = summarize(current.subtree);
      const diff = oldState ? diffSummaries(oldState, newSummary) : null;
      drifted.push({
        slug: comp.slug,
        nodeId: comp.nodeId,
        url,
        reason: 'design changed',
        lastSync: snap.syncedAt,
        diff,
      });
    } else {
      inSync.push({
        slug: comp.slug,
        nodeId: comp.nodeId,
        url,
        lastSync: snap.syncedAt,
      });
    }
  }

  // Output handlers
  if (jsonMode) {
    console.log(JSON.stringify(
      { drifted, inSync, errors, file: { key: manifest.fileKey, name: fileName } },
      null, 2,
    ));
    process.exit(drifted.length > 0 ? 1 : 0);
  }
  if (slugsOnly) {
    for (const d of drifted) console.log(d.slug);
    process.exit(drifted.length > 0 ? 1 : 0);
  }
  if (urlsOnly) {
    for (const d of drifted) console.log(d.url);
    process.exit(drifted.length > 0 ? 1 : 0);
  }

  // Human output — branch on mode
  if (isDetail) {
    renderDetail({ drifted, inSync, errors });
  } else {
    renderSummary({ drifted, inSync, errors });
  }

  process.exit(drifted.length > 0 ? 1 : 0);
}

// ──────────────────────────────────────────────────────────────────────────
// Renderers

function renderSummary({ drifted, inSync, errors }) {
  if (drifted.length > 0) {
    console.log(`⚠️  ${drifted.length} component(s) drifted:\n`);
    for (const d of drifted) {
      const since = d.lastSync ? `last sync: ${relativeTime(d.lastSync)}` : 'never blessed';
      const counts = d.diff
        ? `${d.diff.added.length} added · ${d.diff.modified.length} modified · ${d.diff.removed.length} removed`
        : d.reason;
      console.log(`   • ${d.slug.padEnd(14)} (${since}) → ${counts}`);
      console.log(`     Figma:  ${d.url}`);
      console.log(`     Detail: node scripts/figma/check.mjs ${d.slug}`);
      console.log(`     Sync:   /sync-figma ${d.slug}`);
      console.log();
    }
    if (drifted.length > 1) {
      const slugs = drifted.map((d) => d.slug).join(' ');
      console.log(`To sync all drifted in one go (in Claude Code):`);
      console.log(`   /sync-figma ${slugs}\n`);
    }
  }

  if (inSync.length > 0) {
    console.log(`✓  ${inSync.length} component(s) in sync:`);
    for (const c of inSync) {
      console.log(`   • ${c.slug.padEnd(14)} (last sync: ${relativeTime(c.lastSync)})`);
    }
    console.log();
  }

  if (errors.length > 0) {
    console.log(`✗  ${errors.length} component(s) errored:`);
    for (const e of errors) console.log(`   • ${e.slug.padEnd(14)} → ${e.message}`);
    console.log();
  }

  if (drifted.length === 0 && errors.length === 0) {
    console.log('All tracked components are in sync.');
  }
}

function renderDetail({ drifted, inSync, errors }) {
  for (const d of drifted) {
    const since = d.lastSync ? `last sync: ${relativeTime(d.lastSync)}` : 'never blessed';
    console.log(`⚠️  ${d.slug} — DRIFTED  (${since})\n`);
    console.log(`    Figma:  ${d.url}`);
    console.log(`    Sync:   /sync-figma ${d.slug}\n`);

    if (!d.diff) {
      console.log(`    (no state file yet — bless again to enable detailed diffs)\n`);
      continue;
    }

    const { added, modified, removed } = d.diff;
    console.log(`    Changes: ${added.length} added · ${modified.length} modified · ${removed.length} removed`);
    console.log();

    if (added.length > 0) {
      console.log(`    Variants added (${added.length}):`);
      for (const name of added) console.log(`      + ${name}`);
      console.log();
    }
    if (removed.length > 0) {
      console.log(`    Variants removed (${removed.length}):`);
      for (const name of removed) console.log(`      − ${name}`);
      console.log();
    }
    if (modified.length > 0) {
      console.log(`    Variants modified (${modified.length}):`);
      for (const m of modified) {
        console.log(`      ~ ${m.variant}`);
        for (const c of m.changes) {
          console.log(`          ${c.path}: ${fmt(c.before)}  →  ${fmt(c.after)}`);
        }
      }
      console.log();
    }
  }

  for (const c of inSync) {
    console.log(`✓  ${c.slug} — IN SYNC  (last sync: ${relativeTime(c.lastSync)})`);
    console.log(`    Figma:  ${c.url}`);
    console.log();
  }

  for (const e of errors) {
    console.log(`✗  ${e.slug} — ERROR`);
    console.log(`    ${e.message}\n`);
  }
}

function fmt(value) {
  if (value === undefined) return '∅';
  if (value === null) return 'null';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
