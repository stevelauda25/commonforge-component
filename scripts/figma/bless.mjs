#!/usr/bin/env node
/**
 * pnpm figma:bless [slug...]      → refresh snapshot for given slug(s)
 * pnpm figma:bless --all          → refresh every component in the manifest
 *
 * Run AFTER you have synced the code (manually or via /sync-figma) to mark
 * the current Figma state as the baseline. Or run with --all on first setup
 * to bootstrap the snapshot file.
 */

import {
  hashComponent,
  loadEnv,
  loadManifest,
  loadSnapshots,
  saveSnapshots,
  saveState,
  summarize,
} from './_lib.mjs';

async function main() {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const slugs = args.filter((a) => !a.startsWith('--'));

  const env = loadEnv();
  const manifest = loadManifest();
  const snapshots = loadSnapshots();

  env.FIGMA_FILE_KEY = manifest.fileKey;

  let target;
  if (all) {
    target = manifest.components;
  } else if (slugs.length === 0) {
    console.error(
      'Usage: pnpm figma:bless <slug>...   OR   pnpm figma:bless --all',
    );
    process.exit(1);
  } else {
    const known = new Set(manifest.components.map((c) => c.slug));
    const unknown = slugs.filter((s) => !known.has(s));
    if (unknown.length > 0) {
      console.error(`Unknown slug(s): ${unknown.join(', ')}`);
      console.error(`Known: ${[...known].join(', ')}`);
      process.exit(1);
    }
    target = manifest.components.filter((c) => slugs.includes(c.slug));
  }

  const now = new Date().toISOString();
  snapshots.components = snapshots.components || {};

  for (const comp of target) {
    process.stdout.write(`Hashing ${comp.slug}…  `);
    const { hash, varCount, subtree } = await hashComponent(env, comp.nodeId);
    snapshots.components[comp.slug] = {
      hash,
      varCount,
      syncedAt: now,
      nodeId: comp.nodeId,
    };
    saveState(comp.slug, summarize(subtree));
    console.log(`${hash.slice(0, 12)}…  (${varCount} vars, state saved)`);
  }

  snapshots.version = 1;
  snapshots.syncedAt = now;
  saveSnapshots(snapshots);

  console.log(
    `\n✓ Blessed ${target.length} component(s). Snapshot written to .figma/snapshots.json`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
