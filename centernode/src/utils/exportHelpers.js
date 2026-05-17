


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

// =============================================================
// Extract the inner JSX expression from a function-component code body.
// Falls back to a tag placeholder when the body is too complex to scrape.
function extractInnerJsx(code) {
  if (!code || typeof code !== "string") return null;
  // `return ( ... )` — most common for components with nested JSX
  const m1 = code.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*}/);
  if (m1 && m1[1].includes("<")) return m1[1];
  // `return <Tag .../>` — single-line return without parens
  const m2 = code.match(/return\s+(<[\s\S]*?\/?>)\s*;/);
  if (m2) return m2[1];
  return null;
}

// Reindent a multi-line JSX block by the given amount of spaces. Trims
// leading blank lines so the output starts cleanly under the wrapper.
function indentBlock(block, spaces) {
  const pad = " ".repeat(spaces);
  return block
    .replace(/^\s*\n/, "")
    .split("\n")
    .map((l) => (l.length ? pad + l : l))
    .join("\n");
}

// =============================================================
// Generate a JSX snippet that represents a group as a flex wrapper around
// its children. Live-callable from the inspector — recompute on every
// autolayout / children change. Returns paste-ready code.
//
// Format options (toggled by `format`):
//   - "jsx-inline"   : <div style={{...}}> ... </div>  (default, framework-agnostic)
//   - "jsx-tailwind" : <div className="flex flex-col gap-3"> ... </div>
//   - "html"         : <div style="..."> ... </div>     (plain HTML)
// Build CSS / style props for a child node based on its customSize +
// the parent flex direction. Returns { jsx, tw, html } pieces ready to
// inject into the wrapper-tag string. Empty fragment for default hug.
function childSizeProps(child, parentDir) {
  const wMode = child.customSize?.widthMode || "auto";
  const hMode = child.customSize?.heightMode || "auto";
  const w = typeof child.customSize?.width === "number" ? child.customSize.width : null;
  const h = typeof child.customSize?.height === "number" ? child.customSize.height : null;
  const jsx = [];
  const tw = [];
  const html = [];
  // Width
  if (wMode === "fill") {
    if (parentDir === "row") {
      jsx.push(`flex: "1 1 0"`, `minWidth: 0`);
      tw.push("flex-1", "min-w-0");
      html.push("flex:1 1 0", "min-width:0");
    } else {
      jsx.push(`alignSelf: "stretch"`, `width: "100%"`);
      tw.push("self-stretch", "w-full");
      html.push("align-self:stretch", "width:100%");
    }
  } else if (wMode === "fixed" && w != null) {
    jsx.push(`width: ${w}`);
    tw.push(`w-[${w}px]`);
    html.push(`width:${w}px`);
  }
  // Height
  if (hMode === "fill") {
    if (parentDir === "column") {
      jsx.push(`flex: "1 1 0"`, `minHeight: 0`);
      tw.push("flex-1", "min-h-0");
      html.push("flex:1 1 0", "min-height:0");
    } else {
      jsx.push(`alignSelf: "stretch"`, `height: "100%"`);
      tw.push("self-stretch", "h-full");
      html.push("align-self:stretch", "height:100%");
    }
  } else if (hMode === "fixed" && h != null) {
    jsx.push(`height: ${h}`);
    tw.push(`h-[${h}px]`);
    html.push(`height:${h}px`);
  }
  return { jsx, tw, html };
}

// Wrap a single child's inner JSX with a sizing wrapper when needed.
function wrapChildForSize(innerJsx, props, format) {
  if (format === "jsx-tailwind") {
    if (props.tw.length === 0) return innerJsx;
    // Pick out the inner element's existing className (if any) and merge.
    // Simple approach — wrap in another <div> if we can't safely modify
    // the child's existing className without parsing JSX.
    return `<div className="${props.tw.join(" ")}">\n${indentBlock(innerJsx, 2)}\n</div>`;
  }
  if (format === "html") {
    if (props.html.length === 0) return innerJsx;
    return `<div style="${props.html.join(";")}">\n${indentBlock(innerJsx, 2)}\n</div>`;
  }
  // jsx-inline
  if (props.jsx.length === 0) return innerJsx;
  return `<div style={{ ${props.jsx.join(", ")} }}>\n${indentBlock(innerJsx, 2)}\n</div>`;
}

export function groupToCode(group, allNodes, format = "jsx-inline") {
  if (!group || group.type !== "group") return "";
  const dir = group.autolayout?.direction || "row";
  const gap = group.autolayout?.gap ?? 0;
  const align = group.autolayout?.align || "start";
  const padding = group.autolayout?.padding ?? 0;
  const gWMode = group.customSize?.widthMode || "auto";
  const gHMode = group.customSize?.heightMode || "auto";
  const gW = typeof group.customSize?.width === "number" ? group.customSize.width : null;
  const gH = typeof group.customSize?.height === "number" ? group.customSize.height : null;
  // Appearance — emit only when set so default groups stay minimal.
  const fill = group.style?.fill;
  const isImageFill = typeof fill === "string" && fill.startsWith("url(");
  const fillColor = !isImageFill && typeof fill === "string" ? fill : null;
  const fillImage = isImageFill ? fill : null;
  const radius = typeof group.style?.radius === "number" ? group.style.radius : 0;
  const sw = typeof group.style?.strokeWidth === "number" ? group.style.strokeWidth : 0;
  const sc = typeof group.style?.strokeColor === "string" ? group.style.strokeColor : "#ffffff";
  // CSS alignItems mapping — match the same enum we render with.
  const alignItemsCss = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
  }[align] || "flex-start";
  // Tailwind utility for alignItems.
  const alignTw = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  }[align] || "items-start";

  const children = (group.children || [])
    .map((cid) => allNodes.find((n) => n.id === cid))
    .filter(Boolean);

  const childLines = children
    .map((c) => {
      // JSX snippet children (POD instances) — inline as written.
      const inner =
        c.code && /^\s*</.test(c.code)
          ? c.code.trim()
          : extractInnerJsx(c.code) ||
            `{/* ${c.name} — composite component, copy the function from the node’s code panel */}`;
      // Wrap in a sizing div when the child has fill/fixed CSS to apply.
      const wrapped = wrapChildForSize(inner, childSizeProps(c, dir), format);
      return indentBlock(wrapped, 2);
    })
    .join("\n");

  if (format === "jsx-tailwind") {
    const flexDir = dir === "row" ? "flex-row" : "flex-col";
    const parts = ["flex", flexDir, alignTw, `gap-[${gap}px]`];
    if (padding > 0) parts.push(`p-[${padding}px]`);
    if (gWMode === "fixed" && gW != null) parts.push(`w-[${gW}px]`);
    if (gHMode === "fixed" && gH != null) parts.push(`h-[${gH}px]`);
    if (fillColor) parts.push(`bg-[${fillColor}]`);
    if (radius > 0) parts.push(`rounded-[${radius}px]`);
    if (sw > 0) parts.push(`border-[${sw}px]`, `border-[${sc}]`);
    const cls = parts.join(" ");
    const inlineStyle = fillImage
      ? ` style={{ backgroundImage: ${JSON.stringify(fillImage)}, backgroundSize: "cover", backgroundPosition: "center" }}`
      : "";
    return `<div className="${cls}"${inlineStyle}>\n${childLines}\n</div>`;
  }
  if (format === "html") {
    const segs = [
      `display:flex`,
      `flex-direction:${dir}`,
      `align-items:${alignItemsCss}`,
      `gap:${gap}px`,
    ];
    if (padding > 0) segs.push(`padding:${padding}px`);
    if (gWMode === "fixed" && gW != null) segs.push(`width:${gW}px`);
    if (gHMode === "fixed" && gH != null) segs.push(`height:${gH}px`);
    if (fillColor) segs.push(`background:${fillColor}`);
    if (fillImage) segs.push(`background-image:${fillImage}`, `background-size:cover`, `background-position:center`);
    if (radius > 0) segs.push(`border-radius:${radius}px`);
    if (sw > 0) segs.push(`border:${sw}px solid ${sc}`);
    return `<div style="${segs.join(";")}">\n${childLines}\n</div>`;
  }
  // Default: JSX with inline style.
  const parts = [
    `display: "flex"`,
    `flexDirection: "${dir}"`,
    `alignItems: "${alignItemsCss}"`,
    `gap: ${gap}`,
  ];
  if (padding > 0) parts.push(`padding: ${padding}`);
  if (gWMode === "fixed" && gW != null) parts.push(`width: ${gW}`);
  if (gHMode === "fixed" && gH != null) parts.push(`height: ${gH}`);
  if (fillColor) parts.push(`background: ${JSON.stringify(fillColor)}`);
  if (fillImage) {
    parts.push(`backgroundImage: ${JSON.stringify(fillImage)}`);
    parts.push(`backgroundSize: "cover"`);
    parts.push(`backgroundPosition: "center"`);
  }
  if (radius > 0) parts.push(`borderRadius: ${radius}`);
  if (sw > 0) parts.push(`border: ${JSON.stringify(`${sw}px solid ${sc}`)}`);
  const styleObj = `{ ${parts.join(", ")} }`;
  return `<div style={${styleObj}}>\n${childLines}\n</div>`;
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
