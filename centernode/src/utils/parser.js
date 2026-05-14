// =============================================================
// JSX-snippet helpers — used by canvas nodes that contain a single component
// instance like `<Button variant="primary" size="md">Save changes</Button>`.
// These are POD design-system instances, not user-defined components.
// =============================================================

const JSX_SNIPPET_RE = /^\s*<([A-Z]\w*)/;

export function isJsxSnippet(code) {
  const cleaned = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "").trim();
  return JSX_SNIPPET_RE.test(cleaned);
}

export function extractJsxTag(code) {
  const cleaned = code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "").trim();
  const m = cleaned.match(JSX_SNIPPET_RE);
  return m ? m[1] : null;
}

/**
 * Parse a JSX snippet against a canvasManifest entry. Returns a prop schema
 * compatible with PropInput — known enum props (variant, size) get enum type
 * with options from manifest; arbitrary attrs are strings/booleans/numbers;
 * inner text becomes a `children` string prop.
 */
export function parseJsxSnippetSchema(code, manifestEntry) {
  const schema = {};
  const tag = extractJsxTag(code);
  if (!tag) return schema;

  // 1. Attributes — match  name="value"  name={literal}  name (boolean shorthand)
  const attrRegex = /\s([a-zA-Z][\w-]*)(?:=("[^"]*"|'[^']*'|\{[^}]+\}))?/g;
  // Limit search to the opening tag <Tag ...>
  const openTagEnd = code.indexOf(">");
  const openTag = openTagEnd > 0 ? code.slice(0, openTagEnd + 1) : code;
  let m;
  while ((m = attrRegex.exec(openTag)) !== null) {
    const name = m[1];
    if (name === tag) continue; // skip the tag name itself
    const rawVal = m[2];
    if (rawVal === undefined) {
      // Boolean shorthand: `disabled` → true
      schema[name] = { type: "boolean", default: true };
      continue;
    }
    if (rawVal.startsWith("{")) {
      // JS expression — try literal values
      const inner = rawVal.slice(1, -1).trim();
      if (inner === "true" || inner === "false") {
        schema[name] = { type: "boolean", default: inner === "true" };
      } else if (/^-?\d+(\.\d+)?$/.test(inner)) {
        schema[name] = { type: "number", default: parseFloat(inner) };
      } else {
        schema[name] = { type: "string", default: inner };
      }
      continue;
    }
    // Quoted string
    const str = rawVal.slice(1, -1);
    schema[name] = { type: "string", default: str };
  }

  // 2. Inner text → children prop (only if simple text, not nested JSX)
  const innerMatch = code.match(/>([^<]*?)<\/[A-Z]/);
  if (innerMatch && innerMatch[1].trim()) {
    schema.children = { type: "string", default: innerMatch[1].trim() };
  }

  // 3. Promote variant/size to enums via manifest
  if (manifestEntry) {
    if (schema.variant && manifestEntry.variants?.length) {
      schema.variant = {
        type: "enum",
        options: manifestEntry.variants,
        default: schema.variant.default,
      };
    }
    if (schema.size && manifestEntry.sizes?.length) {
      schema.size = {
        type: "enum",
        options: manifestEntry.sizes,
        default: schema.size.default,
      };
    }
  }

  return schema;
}

// =============================================================
export function parseSchemaFromCode(code) {
  // Strip comments first so we don't parse props from example code in comments
  let cleaned = code.replace(/\/\*[\s\S]*?\*\//g, "");
  cleaned = cleaned.replace(/\/\/[^\n]*/g, "");

  // JSX snippet (component instance) — schema is handled by caller via
  // parseJsxSnippetSchema(code, manifestEntry). We return {} here; the caller
  // can detect JSX via isJsxSnippet() and provide the proper schema with
  // enum metadata. This keeps parseSchemaFromCode side-effect free.
  if (isJsxSnippet(cleaned)) {
    return {};
  }

  if (cleaned.trim().startsWith("<")) {
    const schema = {};
    // 1. Detect CSS Variables in <style> block
    const cssVarRegex = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = cssVarRegex.exec(code)) !== null) {
      const key = `--${match[1]}`;
      const rawVal = match[2].trim();
      const cleanVal = rawVal.replace(/^["']|["']$/g, "");
      let type = "string";
      if (/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\b/i.test(cleanVal) || cleanVal.startsWith("rgb") || cleanVal.startsWith("hsl") || cleanVal === "transparent") {
        type = "color";
      }
      schema[key] = { type, default: cleanVal };
    }

    // 2. Detect Text Variables like {{ title }} or {{ title: "Default Title" }}
    const textVarRegex = /\{\{\s*([a-zA-Z0-9_-]+)(?:\s*:\s*([^}]+))?\s*\}\}/g;
    while ((match = textVarRegex.exec(code)) !== null) {
      const key = match[1];
      const val = match[2] ? match[2].trim().replace(/^["']|["']$/g, "") : "";
      if (!schema[key]) schema[key] = { type: "string", default: val };
    }
    
    return schema;
  }

  const match = cleaned.match(/function\s+[A-Z]\w+\s*\(\s*\{([^}]*)\}/);
  if (!match || !match[1].trim()) return {};
  const schema = {};
  const propRegex = /(\w+)\s*=\s*("([^"]*)"|'([^']*)'|([^,]+))/g;
  let m;
  while ((m = propRegex.exec(match[1])) !== null) {
    const name = m[1];
    const rawValue = m[2].trim();
    if (rawValue === "true" || rawValue === "false") {
      schema[name] = { type: "boolean", default: rawValue === "true" };
    } else if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
      schema[name] = { type: "number", default: parseFloat(rawValue) };
    } else if (m[3] !== undefined || m[4] !== undefined) {
      const val = m[3] ?? m[4];
      let type = "string";
      if (/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\b/i.test(val) || val.startsWith("rgb") || val.startsWith("hsl") || val === "transparent") {
        type = "color";
      }
      schema[name] = { type, default: val };
    } else {
      schema[name] = { type: "string", default: rawValue };
    }
  }

  // Auto-detect enum from xxxStyles patterns — proper brace matching
  const detectEnum = (propName) => {
    // Find: const PROPNAME+Styles = {
    const startPattern = new RegExp(`const\\s+${propName}Styles\\s*=\\s*\\{`);
    const startMatch = code.match(startPattern);
    if (!startMatch) return null;

    const startIdx = startMatch.index + startMatch[0].length;
    // Find matching closing brace using depth counter
    let depth = 1;
    let endIdx = startIdx;
    let inString = false;
    let stringChar = null;
    while (endIdx < code.length && depth > 0) {
      const ch = code[endIdx];
      const prev = code[endIdx - 1];
      if (inString) {
        if (ch === stringChar && prev !== "\\") {
          inString = false;
          stringChar = null;
        }
      } else {
        if (ch === '"' || ch === "'" || ch === "`") {
          inString = true;
          stringChar = ch;
        } else if (ch === "{") depth++;
        else if (ch === "}") depth--;
      }
      if (depth > 0) endIdx++;
    }

    const body = code.substring(startIdx, endIdx);

    // Extract only top-level keys (at depth 0 relative to body)
    const keys = [];
    let d = 0;
    let i = 0;
    let inStr = false;
    let strCh = null;
    while (i < body.length) {
      const ch = body[i];
      const prev = body[i - 1];
      if (inStr) {
        if (ch === strCh && prev !== "\\") {
          inStr = false;
          strCh = null;
        }
        i++;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") {
        inStr = true;
        strCh = ch;
        i++;
        continue;
      }
      if (ch === "{") { d++; i++; continue; }
      if (ch === "}") { d--; i++; continue; }
      // At top level, look for identifier followed by colon
      if (d === 0 && /[a-zA-Z_$]/.test(ch)) {
        let j = i;
        while (j < body.length && /[a-zA-Z0-9_$]/.test(body[j])) j++;
        // Skip whitespace
        let k = j;
        while (k < body.length && /\s/.test(body[k])) k++;
        if (body[k] === ":") {
          keys.push(body.substring(i, j));
        }
        i = j;
        continue;
      }
      i++;
    }

    return keys.length > 0 ? keys : null;
  };

  for (const key of Object.keys(schema)) {
    if (schema[key].type === "string") {
      const enumOptions = detectEnum(key);
      if (enumOptions && enumOptions.includes(schema[key].default)) {
        schema[key] = { type: "enum", options: enumOptions, default: schema[key].default };
      }
    }
  }

  return schema;
}

// =============================================================
export function extractComponentName(code) {
  // Strip comments first to avoid matching function names inside comments
  // Remove block comments /* ... */
  let cleaned = code.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove line comments // ...
  cleaned = cleaned.replace(/\/\/[^\n]*/g, "");
  const m = cleaned.match(/function\s+([A-Z]\w+)\s*\(/);
  return m ? m[1] : "Component";
}

// =============================================================
export function updateCodeWithProp(code, key, value) {
  let updated = code;

  // 0. JSX snippet — update attributes inside `<Tag ...>` or replace children text.
  // Detected by opening uppercase tag at the start.
  if (isJsxSnippet(code)) {
    if (key === "children") {
      // Replace inner text: `>...old text...</Tag>` → `>new text</Tag>`
      return code.replace(/>([^<]*)<\/([A-Z]\w*)>$/, `>${value}</$2>`);
    }
    // Boolean: presence-form attribute (`disabled` or `disabled={true}`)
    if (typeof value === "boolean") {
      // Remove all forms of this attr first
      const stripped = code.replace(new RegExp(`\\s${key}(?:=(?:"[^"]*"|'[^']*'|\\{[^}]+\\}))?`, "g"), "");
      if (!value) return stripped;
      // Re-insert before closing `>` of opening tag
      const m = stripped.match(/^(\s*<[A-Z]\w*\b)([^>]*)(>)/);
      if (!m) return stripped;
      return `${m[1]}${m[2]} ${key}={true}${m[3]}${stripped.slice(m[0].length)}`;
    }
    // String / number — replace existing attr or insert new
    const attrRegex = new RegExp(`(\\s${key}=)("[^"]*"|'[^']*'|\\{[^}]+\\})`);
    if (attrRegex.test(code)) {
      const formatted = typeof value === "number" ? `{${value}}` : `"${value}"`;
      return code.replace(attrRegex, `$1${formatted}`);
    }
    // Insert new attr before closing `>` of opening tag
    const m = code.match(/^(\s*<[A-Z]\w*\b)([^>]*)(>)/);
    if (!m) return code;
    const formatted = typeof value === "number" ? `{${value}}` : `"${value}"`;
    return `${m[1]}${m[2]} ${key}=${formatted}${m[3]}${code.slice(m[0].length)}`;
  }

  // 1. Update CSS Variables: --key: value;
  if (key.startsWith("--")) {
    const cssVarRegex = new RegExp(`(${key}\\s*:\\s*)([^;]+)(;)`, "g");
    updated = updated.replace(cssVarRegex, `$1${value}$3`);
  }
  // 2. Update Template Variables: {{ key: "value" }} or {{ key }}
  else if (code.includes("{{")) {
    const textVarRegex = new RegExp(`(\\{\\{\\s*${key}\\s*)(:\\s*[^}]+)?(\\s*\\}\\})`, "g");
    updated = updated.replace(textVarRegex, (match, start, middle, end) => {
      // If it's a string, wrap in quotes if it's not a number/boolean
      const formattedValue = typeof value === "string" && !/^-?\d+(\.\d+)?$/.test(value) && value !== "true" && value !== "false"
        ? `"${value}"`
        : value;
      return `${start}: ${formattedValue}${end}`;
    });
  }
  // 3. Update React function destructure defaults: `key = value` with whitespace
  //    around `=` and terminated by `,` or `}` (the destructure boundary).
  //    Requires ≥1 space around `=` so JSX attributes like `key={expr}` (no spaces)
  //    don't get clobbered. Matches `key = "string"` / `key = 'string'` /
  //    `key = true|false|null|undefined|number`.
  else {
    const destructureRegex = new RegExp(
      `(\\b${key}\\s+=\\s+)` +
        `("[^"]*"|'[^']*'|true|false|null|undefined|-?\\d+(?:\\.\\d+)?)` +
        `(?=\\s*[,}\\n])`,
      "g",
    );
    updated = updated.replace(destructureRegex, (_match, prefix) => {
      const formattedValue = typeof value === "string" ? `"${value}"` : String(value);
      return `${prefix}${formattedValue}`;
    });
  }

  return updated;
}
