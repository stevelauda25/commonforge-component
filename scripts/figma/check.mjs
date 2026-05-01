#!/usr/bin/env node
/**
 * Drift detection for Figma-tracked components.
 *
 *   node scripts/figma/check.mjs              → summary of ALL tracked
 *   node scripts/figma/check.mjs button       → detailed diff for one
 *   node scripts/figma/check.mjs btn cbx      → detailed diff for several
 *
 * Flags:
 *   --json         JSON output (always full detail). Disables colors.
 *   --slugs-only   Drifted slugs, one per line. For piping.
 *   --urls-only    Drifted Figma URLs, one per line.
 *   --no-color     Disable ANSI colors (or set NO_COLOR env var).
 */

import {
  diffSummaries, figmaUrl, getFileName, hashComponent, loadEnv,
  loadManifest, loadSnapshots, loadState, relativeTime, summarize,
} from './_lib.mjs';

import {
  c, card, changeLine, parseRgb, rgbToHex, ruleHeavy, ruleLight,
  sectionHeader, status, statusColor, swatch, termWidth,
} from './_ui.mjs';

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

  if (isDetail) {
    const known = new Set(manifest.components.map((cm) => cm.slug));
    const unknown = targets.filter((t) => !known.has(t));
    if (unknown.length > 0) {
      console.error(c.red(`✗ Unknown slug(s): ${unknown.join(', ')}`));
      console.error(c.dim(`  Tracked: ${[...known].join(', ') || '(none)'}`));
      process.exit(2);
    }
  }

  if (!quietMode) printHeader(fileName, manifest, isDetail);

  const drifted = [];
  const inSync = [];
  const errors = [];

  for (const comp of manifest.components) {
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
      drifted.push({ slug: comp.slug, nodeId: comp.nodeId, url, reason: 'never blessed', lastSync: null, diff: null, neverBlessed: true });
      continue;
    }
    if (snap.hash !== current.hash) {
      const oldState = loadState(comp.slug);
      const newSummary = summarize(current.subtree);
      const diff = oldState ? diffSummaries(oldState, newSummary) : null;
      drifted.push({ slug: comp.slug, nodeId: comp.nodeId, url, reason: 'design changed', lastSync: snap.syncedAt, diff });
    } else {
      inSync.push({ slug: comp.slug, nodeId: comp.nodeId, url, lastSync: snap.syncedAt });
    }
  }

  // Quiet output paths
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

  if (isDetail) {
    renderDetail({ drifted, inSync, errors });
  } else {
    renderSummary({ drifted, inSync, errors });
  }
  process.exit(drifted.length > 0 ? 1 : 0);
}

// ────────────────────────────────────────────────────────────────────
// Header

function printHeader(fileName, manifest, isDetail) {
  const w = termWidth();
  console.log();
  console.log(ruleHeavy(w));
  if (isDetail) {
    console.log('  ' + c.bold(c.cyan('🔍 Figma Drift Detection — Detail')));
    console.log('  ' + c.dim('Components: ') + targets.map((t) => c.bold(t)).join(', '));
  } else {
    console.log('  ' + c.bold(c.cyan('🔍 Figma Drift Detection')));
    console.log('  ' + c.dim('Tracking ') + c.bold(`${manifest.components.length} component(s)`));
  }
  console.log('  ' + c.dim('File:       ') + fileName + '  ' + c.dim(`(${manifest.fileKey})`));
  console.log(ruleHeavy(w));
  console.log();
}

// ────────────────────────────────────────────────────────────────────
// Summary mode

function renderSummary({ drifted, inSync, errors }) {
  if (drifted.length > 0) {
    console.log('  ' + c.bold(c.yellow(`⚠  ${drifted.length} component(s) drifted`)));
    console.log();

    for (const d of drifted) {
      const since = d.lastSync ? c.dim(`last sync: ${relativeTime(d.lastSync)}`) : c.gray('never blessed');
      const counts = d.diff
        ? formatChangeCounts(d.diff)
        : (d.neverBlessed ? c.gray('bootstrap required') : c.dim(d.reason));

      // Compact card: just status — URLs go below at full width
      const body = [
        c.dim('Status:   ') + since,
        c.dim('Changes:  ') + counts,
      ].join('\n');

      console.log(card(d.slug, body, {
        badge: d.neverBlessed ? '○ NEVER BLESSED' : '● DRIFTED',
        badgeColor: d.neverBlessed ? c.gray : c.yellow,
      }));
      console.log('  ' + c.dim('Figma:   ') + c.uline(c.blue(d.url)));
      console.log('  ' + c.dim('Detail:  ') + c.cyan(`node scripts/figma/check.mjs ${d.slug}`));
      console.log('  ' + c.dim('Sync:    ') + c.cyan(`/sync-figma ${d.slug}`));
      console.log();
    }

    if (drifted.length > 1) {
      const slugs = drifted.map((d) => d.slug).join(' ');
      console.log('  ' + c.dim('Sync all in one go:  ') + c.cyan(`/sync-figma ${slugs}`));
      console.log();
    }
  }

  if (inSync.length > 0) {
    console.log('  ' + c.bold(c.green(`✓  ${inSync.length} component(s) in sync`)));
    console.log();
    const longest = Math.max(...inSync.map((c) => c.slug.length));
    for (const cIn of inSync) {
      console.log(
        '    ' +
        c.green('●') + ' ' +
        c.bold(cIn.slug.padEnd(longest + 2)) +
        c.dim(`last sync: ${relativeTime(cIn.lastSync)}`),
      );
    }
    console.log();
  }

  if (errors.length > 0) {
    console.log('  ' + c.bold(c.red(`✗  ${errors.length} component(s) errored`)));
    console.log();
    for (const e of errors) {
      console.log('    ' + c.red('●') + ' ' + c.bold(e.slug) + c.dim('  ' + e.message));
    }
    console.log();
  }

  if (drifted.length === 0 && errors.length === 0) {
    console.log('  ' + c.green('✓ All tracked components are in sync.'));
    console.log();
  }
}

// ────────────────────────────────────────────────────────────────────
// Detail mode

function renderDetail({ drifted, inSync, errors }) {
  for (const d of drifted) {
    const since = d.lastSync ? `last sync: ${relativeTime(d.lastSync)}` : 'never blessed';

    console.log('  ' + (d.neverBlessed ? status.newComp : status.drifted) + '   ' + c.bold(d.slug));
    console.log('  ' + c.dim(since));
    console.log();
    console.log('  ' + c.dim('Figma:   ') + c.uline(c.blue(d.url)));
    console.log('  ' + c.dim('Sync:    ') + c.cyan(`/sync-figma ${d.slug}`));
    console.log();

    if (!d.diff) {
      console.log('  ' + c.dim('(no state file yet — bless again to enable detailed diffs)'));
      console.log();
      continue;
    }

    console.log('  ' + c.bold('Changes'));
    console.log('  ' + ruleLight(termWidth() - 2));
    console.log('  ' + formatChangeCounts(d.diff));
    console.log();

    if (d.diff.added.length > 0) {
      console.log('  ' + sectionHeader('➕ Variants added', d.diff.added.length, c.green));
      console.log('  ' + ruleLight(termWidth() - 2));
      for (const name of d.diff.added) {
        console.log('    ' + c.green('+') + ' ' + name);
      }
      console.log();
    }
    if (d.diff.removed.length > 0) {
      console.log('  ' + sectionHeader('➖ Variants removed', d.diff.removed.length, c.red));
      console.log('  ' + ruleLight(termWidth() - 2));
      for (const name of d.diff.removed) {
        console.log('    ' + c.red('−') + ' ' + name);
      }
      console.log();
    }
    if (d.diff.modified.length > 0) {
      console.log('  ' + sectionHeader('✏️  Variants modified', d.diff.modified.length, c.yellow));
      console.log('  ' + ruleLight(termWidth() - 2));
      for (let i = 0; i < d.diff.modified.length; i++) {
        const m = d.diff.modified[i];
        console.log('    ' + c.yellow('~') + ' ' + c.bold(m.variant));
        for (const ch of m.changes) {
          console.log(formatChange(ch));
        }
        if (i < d.diff.modified.length - 1) console.log();
      }
      console.log();
    }
  }

  for (const cIn of inSync) {
    console.log('  ' + status.inSync + '   ' + c.bold(cIn.slug));
    console.log('  ' + c.dim(`last sync: ${relativeTime(cIn.lastSync)}`));
    console.log();
    console.log('  ' + c.dim('Figma:   ') + c.uline(c.blue(cIn.url)));
    console.log();
  }

  for (const e of errors) {
    console.log('  ' + status.error + '   ' + c.bold(e.slug));
    console.log('  ' + c.red(e.message));
    console.log();
  }
}

// ────────────────────────────────────────────────────────────────────
// Helpers

function formatChangeCounts(diff) {
  const parts = [];
  if (diff.added.length > 0)    parts.push(c.green(`+${diff.added.length} added`));
  if (diff.modified.length > 0) parts.push(c.yellow(`~${diff.modified.length} modified`));
  if (diff.removed.length > 0)  parts.push(c.red(`−${diff.removed.length} removed`));
  return parts.length > 0 ? parts.join(c.dim(' · ')) : c.dim('no changes');
}

/**
 * Friendly label + value renderer for one change row.
 *
 * Path examples handled specially:
 *   fills[0].color           → "color"  + swatch + hex
 *   strokes[0].color         → "stroke" + swatch + hex
 *   bindings.fills[0]        → "fill binding"   + variable id
 *   bindings.cornerRadius    → "radius binding" + variable id
 *   paddingLeft              → "padding left"   + px
 *   cornerRadius             → "corner radius"  + px
 */
function formatChange(ch) {
  const indent = '        ';
  const { label, formatValueFn } = describePath(ch.path);

  const beforeStr = formatValueFn(ch.before);
  const afterStr  = formatValueFn(ch.after);

  return indent + c.cyan(label.padEnd(22)) + beforeStr + c.dim('  →  ') + afterStr;
}

function describePath(path) {
  // Color in fills/strokes
  if (/^(fills|strokes)\[\d+\]\.color$/.test(path)) {
    const which = path.startsWith('fills') ? 'fill color' : 'stroke color';
    return { label: which, formatValueFn: colorValue };
  }
  // Visibility / opacity / type within fills/strokes
  if (/^(fills|strokes)\[\d+\]\.(opacity|visible|type)$/.test(path)) {
    const part = path.split('.').pop();
    const prefix = path.startsWith('fills') ? 'fill' : 'stroke';
    return { label: `${prefix} ${part}`, formatValueFn: scalarValue };
  }
  // Variable bindings
  if (/^bindings\./.test(path)) {
    const rest = path.replace(/^bindings\./, '');
    return { label: friendlyBinding(rest), formatValueFn: variableValue };
  }
  // Friendly aliases for common scalar paths
  const aliases = {
    cornerRadius: 'corner radius',
    rectangleCornerRadii: 'corner radii',
    strokeWeight: 'stroke weight',
    paddingLeft: 'padding left',
    paddingRight: 'padding right',
    paddingTop: 'padding top',
    paddingBottom: 'padding bottom',
    itemSpacing: 'item spacing',
    layoutMode: 'layout mode',
    primaryAxisAlignItems: 'main-axis align',
    counterAxisAlignItems: 'cross-axis align',
    childCount: 'child count',
    childNames: 'child layers',
    type: 'type',
  };
  if (aliases[path]) return { label: aliases[path], formatValueFn: scalarValue };

  // Effects subpath (e.g. effects[0].radius)
  if (path.startsWith('effects[')) {
    return { label: path.replace(/^effects/, 'effect'), formatValueFn: scalarValue };
  }

  return { label: path, formatValueFn: scalarValue };
}

function friendlyBinding(rest) {
  // bindings.fills[0]      → fill binding
  // bindings.strokes[0]    → stroke binding
  // bindings.cornerRadius  → corner radius binding
  // bindings.paddingLeft   → padding-left binding
  if (/^fills\[\d+\]$/.test(rest))   return 'fill binding';
  if (/^strokes\[\d+\]$/.test(rest)) return 'stroke binding';
  const aliases = {
    cornerRadius: 'corner radius binding',
    paddingLeft:  'padding-left binding',
    paddingRight: 'padding-right binding',
    paddingTop:   'padding-top binding',
    paddingBottom:'padding-bottom binding',
    itemSpacing:  'item-spacing binding',
    strokeWeight: 'stroke-weight binding',
  };
  return aliases[rest] || `${rest} binding`;
}

function colorValue(v) {
  if (typeof v !== 'string') return scalarValue(v);
  const rgb = parseRgb(v);
  if (!rgb) return c.dim(String(v));
  return swatch(v) + ' ' + c.bold(rgbToHex(rgb));
}

function variableValue(v) {
  if (v === undefined || v === null) return c.dim('∅');
  return c.bold(String(v));
}

function scalarValue(v) {
  if (v === undefined) return c.dim('∅');
  if (v === null) return c.dim('null');
  if (typeof v === 'object') {
    const json = JSON.stringify(v);
    return c.dim(json.length > 60 ? json.slice(0, 60) + '…' : json);
  }
  // Add px suffix for known scalars
  if (typeof v === 'number') return c.bold(String(v)) + c.dim('px');
  return c.bold(String(v));
}

main().catch((err) => {
  console.error(c.red('✗ Error:'), err.message);
  console.error(c.dim(err.stack));
  process.exit(1);
});
