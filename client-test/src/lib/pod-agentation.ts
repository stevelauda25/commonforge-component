import type { Annotation } from 'agentation';

// POD-aware enrichment of agentation output. When user adds an annotation,
// we prepend POD context so Claude eksekusi mengikuti PAKEM rule client-test.
//
// Why: agentation captures DOM/React metadata generic. It tidak tahu:
//   - bahwa Button/Checkbox/SearchInput/Tooltip itu primitif WAJIB dipakai
//   - bahwa accent-* itu sacred token (jangan diubah)
//   - bahwa local component harus pakai POD tokens (no hex)
//
// Source of truth untuk daftar component + token = pod-test-ui/AGENTS.md
// yang di-ship dalam npm package. Update otomatis pas `npm update`.

const POD_PRIMITIVES = new Set(['Button', 'Checkbox', 'SearchInput', 'Tooltip']);

function detectPodComponent(annotation: Annotation): string | null {
  // Cek apakah element ini POD primitive berdasarkan name yang agentation deteksi.
  const name = annotation.element;
  if (POD_PRIMITIVES.has(name)) return name;

  // Fallback: cek reactComponents path
  const rc = annotation.reactComponents ?? '';
  for (const prim of POD_PRIMITIVES) {
    if (rc.includes(`<${prim}`) || rc.includes(`<${prim}>`)) return prim;
  }
  return null;
}

function enrichSingle(annotation: Annotation): string {
  const podMatch = detectPodComponent(annotation);
  const lines: string[] = [];

  lines.push(`### Annotation: ${annotation.element}`);
  lines.push('');
  lines.push(`**User intent:** ${annotation.comment}`);
  lines.push('');

  if (podMatch) {
    lines.push(`**POD context:** Target is \`<${podMatch}>\` from \`pod-test-ui\` (a tracked primitive).`);
    lines.push(`→ Edit MUST keep this as \`<${podMatch}>\`. Don't replace with native \`<button>\`/\`<input>\`.`);
    lines.push(`→ Available props/variants: see \`node_modules/pod-test-ui/AGENTS.md\` (ground truth, auto-syncs on npm update).`);
  } else {
    lines.push(`**POD context:** Target is a **local component**, not a POD primitive.`);
    lines.push(`→ Any styling change MUST use POD semantic tokens (\`bg-canvas\`, \`text-text-primary\`, etc.). No hex codes.`);
    lines.push(`→ Check if intent maps to a POD primitive — if "ganti ke checkbox" or similar, use \`<Checkbox>\` from \`pod-test-ui\`.`);
  }

  lines.push('');
  lines.push(`**Location:** \`${annotation.elementPath}\``);
  if (annotation.cssClasses) lines.push(`**Current classes:** \`${annotation.cssClasses}\``);
  if (annotation.nearbyText) lines.push(`**Nearby text:** ${annotation.nearbyText}`);
  if (annotation.selectedText) lines.push(`**Selected text:** ${annotation.selectedText}`);

  return lines.join('\n');
}

export function enrichAgentationOutput(annotations: Annotation[]): string {
  if (annotations.length === 0) return '';

  const header = [
    '# Agentation Feedback — POD-enriched',
    '',
    'You are editing a project that uses **POD Design System** (`pod-test-ui` + `pod-test-tokens`).',
    '',
    '**Hard rules** (zero exceptions — see `client-test/CLAUDE.md`):',
    '- Every UI change must use POD primitives + semantic tokens.',
    '- Sacred tokens (`accent-*`, `danger-*`, `warning-*`, etc.) are never modified.',
    '- New colors → `experiment-<name>` token + targeted variant override.',
    '- No hex codes, no `rgb()`, no `dark:` modifiers, no native `<button>`/`<input>`.',
    '- Available primitives + tokens: read `node_modules/pod-test-ui/AGENTS.md` (auto-syncs on `npm update`).',
    '',
    '---',
    '',
  ];

  const body = annotations.map(enrichSingle).join('\n\n---\n\n');
  return [...header, body].join('\n');
}
