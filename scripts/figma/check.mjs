#!/usr/bin/env node
/**
 * pnpm figma:check  (or: node scripts/figma/check.mjs)
 *
 * Compare every tracked component's current variable surface against the
 * snapshot. Exit 0 when everything is in sync, 1 when drift is detected.
 *
 * Flags:
 *   --json         Output structured JSON (machine-readable). No human prose.
 *   --slugs-only   Print drifted slugs (one per line) and nothing else.
 *                  Useful for: `for slug in $(figma:check --slugs-only); do …`
 *   --urls-only    Print Figma URLs (one per line) for drifted components.
 */

import {
  figmaUrl,
  getFileName,
  hashComponent,
  loadEnv,
  loadManifest,
  loadSnapshots,
  relativeTime,
} from './_lib.mjs';

const args = new Set(process.argv.slice(2));
const jsonMode = args.has('--json');
const slugsOnly = args.has('--slugs-only');
const urlsOnly = args.has('--urls-only');
const quietMode = jsonMode || slugsOnly || urlsOnly;

async function main() {
  const env = loadEnv();
  const manifest = loadManifest();
  const snapshots = loadSnapshots();
  env.FIGMA_FILE_KEY = manifest.fileKey;

  const fileName = await getFileName(env);

  if (!quietMode) {
    console.log(
      `🔍 Checking ${manifest.components.length} component(s) against ` +
      `Figma file ${fileName} (${manifest.fileKey})…\n`,
    );
  }

  const drifted = [];
  const inSync = [];
  const errors = [];

  for (const comp of manifest.components) {
    const snap = snapshots.components?.[comp.slug];
    let current;
    try {
      current = await hashComponent(env, comp.nodeId);
    } catch (err) {
      errors.push({ slug: comp.slug, message: err.message });
      continue;
    }

    const url = figmaUrl(manifest.fileKey, comp.nodeId, fileName);
    const ref = `${manifest.fileKey}:${comp.nodeId}`;

    if (!snap) {
      drifted.push({ slug: comp.slug, nodeId: comp.nodeId, url, ref, reason: 'never blessed', lastSync: null });
      continue;
    }
    if (snap.hash !== current.hash) {
      drifted.push({
        slug: comp.slug,
        nodeId: comp.nodeId,
        url,
        ref,
        reason: 'variable surface changed',
        lastSync: snap.syncedAt,
      });
    } else {
      inSync.push({ slug: comp.slug, lastSync: snap.syncedAt });
    }
  }

  if (jsonMode) {
    console.log(JSON.stringify({ drifted, inSync, errors, file: { key: manifest.fileKey, name: fileName } }, null, 2));
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

  // Human output
  if (drifted.length > 0) {
    console.log(`⚠️  ${drifted.length} component(s) drifted:\n`);
    for (const d of drifted) {
      const since = d.lastSync ? `last sync: ${relativeTime(d.lastSync)}` : 'never blessed';
      console.log(`   • ${d.slug.padEnd(14)} (${since}) → ${d.reason}`);
      console.log(`     Figma:  ${d.url}`);
      console.log(`     Sync:   /sync-figma ${d.slug}`);
      console.log();
    }

    if (drifted.length > 1) {
      const slugs = drifted.map((d) => d.slug).join(' ');
      console.log(`To sync all drifted components in one go (in Claude Code):`);
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
    for (const e of errors) {
      console.log(`   • ${e.slug.padEnd(14)} → ${e.message}`);
    }
    console.log();
  }

  if (drifted.length > 0) {
    console.log('After /sync-figma updates the code and you reviewed the diff:');
    console.log('   node scripts/figma/bless.mjs <slug>     — mark as in-sync');
    console.log('   node scripts/figma/bless.mjs --all      — bless every component');
    process.exit(1);
  }

  console.log('All tracked components are in sync.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
