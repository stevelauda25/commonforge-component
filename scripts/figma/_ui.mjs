/**
 * Tiny terminal UI helpers — ANSI colors, box drawing, RGB swatches.
 * Zero dependencies. TTY-aware (colors auto-disabled when piped).
 */

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;

function w(code, str) {
  return useColor ? `\x1b[${code}m${str}\x1b[0m` : str;
}

export const c = {
  bold:   (s) => w('1',  s),
  dim:    (s) => w('2',  s),
  italic: (s) => w('3',  s),
  uline:  (s) => w('4',  s),
  red:    (s) => w('31', s),
  green:  (s) => w('32', s),
  yellow: (s) => w('33', s),
  blue:   (s) => w('34', s),
  magenta:(s) => w('35', s),
  cyan:   (s) => w('36', s),
  gray:   (s) => w('90', s),
  bgRgb:  (r, g, b, s) =>
    useColor ? `\x1b[48;2;${r};${g};${b}m${s}\x1b[0m` : s,
};

export function termWidth() {
  return process.stdout.isTTY ? Math.min(process.stdout.columns || 80, 100) : 80;
}

const visibleLength = (s) => s.replace(/\x1b\[[0-9;]*m/g, '').length;

export function ruleHeavy(width = termWidth()) { return c.dim('═'.repeat(width)); }
export function ruleLight(width = termWidth()) { return c.dim('─'.repeat(width)); }

/**
 * Render a labeled box with a title in the top border.
 *
 *   ┌── title ─────────────── badge ──┐
 *   │  body line 1                    │
 *   │  body line 2                    │
 *   └─────────────────────────────────┘
 */
export function card(title, body, { badge, badgeColor, width } = {}) {
  const w = width || termWidth();
  const titleStr = c.bold(title);
  const badgeStr = badge ? (badgeColor ? badgeColor(badge) : badge) : '';
  const titleVisible = visibleLength(titleStr);
  const badgeVisible = visibleLength(badgeStr);
  // top: ┌── title ──── ··· ──── badge ──┐
  const dashesLeft = 2;
  const minDashesRight = 2;
  const middle = w - 2 - dashesLeft - 1 - titleVisible - 1 - badgeVisible - 1 - minDashesRight;
  const middleDashes = Math.max(2, middle);
  const top = badge
    ? c.dim('┌' + '─'.repeat(dashesLeft) + ' ') + titleStr + c.dim(' ' + '─'.repeat(middleDashes) + ' ') + badgeStr + c.dim(' ' + '─'.repeat(minDashesRight) + '┐')
    : c.dim('┌' + '─'.repeat(dashesLeft) + ' ') + titleStr + c.dim(' ' + '─'.repeat(w - 2 - dashesLeft - 1 - titleVisible - 1) + '┐');

  const bodyLines = body.split('\n').map((line) => {
    const padding = w - 2 - visibleLength(line) - 4;
    return c.dim('│  ') + line + ' '.repeat(Math.max(0, padding)) + c.dim('  │');
  });

  const bottom = c.dim('└' + '─'.repeat(w - 2) + '┘');
  return [top, ...bodyLines, bottom].join('\n');
}

/**
 * Render a section header with a horizontal rule below.
 *   📌 Section title (count)
 *   ─────────────────────────────────────────
 */
export function sectionHeader(title, count, color = c.cyan) {
  const countStr = count !== undefined ? c.dim(`(${count})`) : '';
  return color(c.bold(title)) + (countStr ? '  ' + countStr : '');
}

// Status badges
export const status = {
  drifted:    c.yellow('● DRIFTED'),
  inSync:     c.green('● IN SYNC'),
  newComp:    c.gray('● NEVER BLESSED'),
  error:      c.red('● ERROR'),
};

// Status colors for inline use
export const statusColor = {
  drifted: c.yellow,
  inSync:  c.green,
  newComp: c.gray,
  error:   c.red,
};

// Parse "rgb(R, G, B, a=A)" → {r, g, b, a}
export function parseRgb(str) {
  const m = /rgb\((\d+),\s*(\d+),\s*(\d+)(?:,\s*a=([\d.]+))?\)/.exec(str);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
}

export function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

/**
 * Render a color swatch: 4-char wide background color block.
 *   "  ▮▮  "  with bg=color
 */
export function swatch(rgbString) {
  const rgb = parseRgb(rgbString);
  if (!rgb) return c.dim('[?]');
  return c.bgRgb(rgb.r, rgb.g, rgb.b, '    ');
}

/**
 * Inline change line: "label   before  →  after"  with proper alignment.
 * If from/to are colors, render swatches.
 */
export function changeLine(label, before, after, indent = 6) {
  const pad = ' '.repeat(indent);
  const arrow = c.dim('  →  ');
  const renderValue = (v) => {
    if (typeof v === 'string') {
      const rgb = parseRgb(v);
      if (rgb) return swatch(v) + ' ' + c.dim(rgbToHex(rgb));
    }
    if (v === undefined || v === null || v === '∅') return c.dim('∅');
    if (typeof v === 'object') {
      const json = JSON.stringify(v);
      return json.length > 60 ? c.dim(json.slice(0, 60) + '…') : c.dim(json);
    }
    return String(v);
  };
  return pad + c.cyan(label.padEnd(18)) + renderValue(before) + arrow + renderValue(after);
}
