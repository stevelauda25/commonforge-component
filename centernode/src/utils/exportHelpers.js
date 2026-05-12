


// This is a simple transformer that handles common patterns
export function convertHToJSX(code) {
  // Strip the entire "comment header" blocks for cleaner output
  // (keep inline comments, just remove the doc headers we added)
  let result = code;

  // Convert h('tag', props, ...children) to <tag ...props>...children</tag>
  // This handles common cases — complex nested code may need manual review.
  //
  // Strategy: find balanced h(...) calls and transform them.
  // We walk the string, identify h( calls, find matching close paren,
  // then recursively process arguments.

  const transform = (src) => {
    let out = "";
    let i = 0;
    while (i < src.length) {
      // Find next h( call at identifier boundary
      const match = src.substring(i).match(/(^|[^a-zA-Z0-9_$])h\(/);
      if (!match) {
        out += src.substring(i);
        break;
      }
      const hStart = i + match.index + match[1].length;
      out += src.substring(i, hStart);

      // Find matching close paren
      let depth = 1;
      let j = hStart + 2; // skip "h("
      let inStr = false, strCh = null;
      while (j < src.length && depth > 0) {
        const ch = src[j];
        const prev = src[j - 1];
        if (inStr) {
          if (ch === strCh && prev !== "\\") { inStr = false; strCh = null; }
        } else {
          if (ch === '"' || ch === "'" || ch === "`") { inStr = true; strCh = ch; }
          else if (ch === "(") depth++;
          else if (ch === ")") depth--;
        }
        if (depth > 0) j++;
      }

      const argsString = src.substring(hStart + 2, j);
      // Transform this h(...) call
      out += transformH(argsString);
      i = j + 1;
    }
    return out;
  };

  const splitTopLevelArgs = (s) => {
    const args = [];
    let current = "";
    let depth = 0;
    let inStr = false, strCh = null;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      const prev = s[i - 1];
      if (inStr) {
        if (ch === strCh && prev !== "\\") { inStr = false; strCh = null; }
        current += ch;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === "`") { inStr = true; strCh = ch; current += ch; continue; }
      if (ch === "(" || ch === "[" || ch === "{") depth++;
      else if (ch === ")" || ch === "]" || ch === "}") depth--;
      if (ch === "," && depth === 0) {
        args.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    if (current.trim()) args.push(current.trim());
    return args;
  };

  const transformH = (argsString) => {
    // Recursively transform nested h() first
    const processedArgs = transform(argsString);
    const args = splitTopLevelArgs(processedArgs);
    if (args.length === 0) return "<></>";

    // First arg: tag
    let tag = args[0].trim();
    const isStringTag = (tag.startsWith('"') || tag.startsWith("'"));
    const tagName = isStringTag ? tag.slice(1, -1) : tag;

    // Second arg: props (object, null, or undefined)
    const propsArg = args[1] ?? "null";
    let propsStr = "";
    if (propsArg !== "null" && propsArg !== "undefined" && propsArg.trim()) {
      propsStr = convertPropsToJSX(propsArg);
    }

    // Rest: children
    const childrenArgs = args.slice(2);
    const children = childrenArgs.map((c) => convertChildToJSX(c)).join("");

    if (childrenArgs.length === 0) {
      return `<${tagName}${propsStr} />`;
    }
    return `<${tagName}${propsStr}>${children}</${tagName}>`;
  };

  const convertPropsToJSX = (propsSource) => {
    // Parse object literal { key: value, ... } into JSX attrs
    // Strip surrounding braces
    const trimmed = propsSource.trim();
    if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
      // Complex case — just pass through as spread
      return ` {...(${trimmed})}`;
    }
    const body = trimmed.slice(1, -1).trim();
    if (!body) return "";

    // Split by top-level commas
    const entries = splitTopLevelArgs(body);
    const attrs = entries.map((entry) => {
      // Handle spread ...obj
      if (entry.startsWith("...")) {
        return `{...${entry.slice(3).trim()}}`;
      }
      // Find colon at top level
      let depth = 0, inStr = false, strCh = null, colonIdx = -1;
      for (let i = 0; i < entry.length; i++) {
        const ch = entry[i];
        const prev = entry[i - 1];
        if (inStr) {
          if (ch === strCh && prev !== "\\") { inStr = false; strCh = null; }
          continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") { inStr = true; strCh = ch; continue; }
        if (ch === "(" || ch === "[" || ch === "{") depth++;
        else if (ch === ")" || ch === "]" || ch === "}") depth--;
        if (ch === ":" && depth === 0) { colonIdx = i; break; }
      }
      if (colonIdx === -1) return "";
      const key = entry.substring(0, colonIdx).trim().replace(/^['"`]|['"`]$/g, "");
      const value = entry.substring(colonIdx + 1).trim();
      // String literal → key="value"
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return `${key}=${value.replace(/'/g, '"')}`;
      }
      // Boolean true shorthand
      if (value === "true") return key;
      // Everything else → key={value}
      return `${key}={${value}}`;
    }).filter(Boolean);

    return attrs.length ? " " + attrs.join(" ") : "";
  };

  const convertChildToJSX = (child) => {
    const trimmed = child.trim();
    // String literal
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    // Template literal
    if (trimmed.startsWith("`") && trimmed.endsWith("`")) {
      return `{${trimmed}}`;
    }
    // Nested element (already transformed)
    if (trimmed.startsWith("<")) return trimmed;
    // Expression
    return `{${trimmed}}`;
  };

  result = transform(result);
  return result;
}

// Generate tokens.css from tokens object
export function tokensToCSS(tokens) {
  let css = "/* Design tokens — exported from Playground */\n";
  css += ":root {\n";
  for (const [category, values] of Object.entries(tokens)) {
    css += `\n  /* ${category} */\n`;
    for (const [key, val] of Object.entries(values)) {
      css += `  --token-${category}-${key}: ${val};\n`;
    }
  }
  css += "}\n";
  return css;
}

// Generate Tailwind config extension from tokens
export function tokensToTailwind(tokens) {
  const lines = [
    "// Tailwind config extension — exported from Playground",
    "// Merge this into your tailwind.config.js theme.extend",
    "",
    "module.exports = {",
    "  theme: {",
    "    extend: {",
  ];
  if (tokens.colors) {
    lines.push("      colors: {");
    for (const [key, val] of Object.entries(tokens.colors)) {
      lines.push(`        "${key}": "${val}",`);
    }
    lines.push("      },");
  }
  if (tokens.spacing) {
    lines.push("      spacing: {");
    for (const [key, val] of Object.entries(tokens.spacing)) {
      lines.push(`        "${key}": "${val}",`);
    }
    lines.push("      },");
  }
  if (tokens.radius) {
    lines.push("      borderRadius: {");
    for (const [key, val] of Object.entries(tokens.radius)) {
      lines.push(`        "${key}": "${val}",`);
    }
    lines.push("      },");
  }
  if (tokens.fontSize) {
    lines.push("      fontSize: {");
    for (const [key, val] of Object.entries(tokens.fontSize)) {
      lines.push(`        "${key}": "${val}",`);
    }
    lines.push("      },");
  }
  lines.push("    },");
  lines.push("  },");
  lines.push("};");
  return lines.join("\n");
}

// Export a single node as a complete .jsx file
export function nodeToJSXFile(node) {
  const jsxBody = convertHToJSX(node.code);
  return `// ${node.name} — exported from Playground
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

${jsxBody}
`;
}

// Download helper
export function downloadFile(filename, content, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
