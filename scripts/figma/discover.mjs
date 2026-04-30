#!/usr/bin/env node
/**
 * One-shot discovery: walk the Figma file and list all COMPONENT_SET nodes.
 * Used to bootstrap .figma/manifest.json — pick the slugs you want to track.
 *
 * Usage:
 *   node scripts/figma/discover.mjs
 *
 * Reads FIGMA_PAT and FIGMA_FILE_KEY from .env.local at repo root.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

function loadEnv() {
  const path = resolve(repoRoot, '.env.local');
  const text = readFileSync(path, 'utf8');
  const env = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

function walk(node, parentPage, out) {
  if (node.type === 'COMPONENT_SET') {
    out.push({
      id: node.id,
      name: node.name,
      page: parentPage,
      childCount: (node.children || []).length,
    });
  }
  for (const child of node.children || []) {
    walk(child, parentPage, out);
  }
}

async function main() {
  const env = loadEnv();
  if (!env.FIGMA_PAT || !env.FIGMA_FILE_KEY) {
    console.error('Missing FIGMA_PAT or FIGMA_FILE_KEY in .env.local');
    process.exit(1);
  }

  const url = `https://api.figma.com/v1/files/${env.FIGMA_FILE_KEY}?depth=4`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': env.FIGMA_PAT },
  });

  if (!res.ok) {
    console.error(`Figma API error: ${res.status} ${res.statusText}`);
    console.error(await res.text());
    process.exit(1);
  }

  const data = await res.json();
  console.log(`File: ${data.name}`);
  console.log(`Last modified: ${data.lastModified}`);
  console.log();

  const componentSets = [];
  for (const page of data.document.children || []) {
    walk(page, page.name, componentSets);
  }

  console.log(`Found ${componentSets.length} component set(s):\n`);
  for (const cs of componentSets) {
    console.log(`  ${cs.id.padEnd(14)} "${cs.name}" — page: ${cs.page}, ${cs.childCount} variants`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
