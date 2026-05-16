// =============================================================
// Dependency-free JSX/HTML tokenizer for the code preview.
//
// Returns an array of { text, type } tokens. Consumer maps each to a
// colored <span>. Why a real state machine instead of regex-on-string +
// dangerouslySetInnerHTML: regex passes over an already-decorated string
// re-match the spans' own attributes (e.g. `style=`), producing nested
// broken HTML. A tokenizer walks once and emits typed slices — impossible
// to re-match yourself.

export const TOKEN_COLOR = {
  tag:     "#7dd3fc", // sky-300 — element / fragment names
  attr:    "#c4b5fd", // violet-300 — attribute names
  string:  "#fbbf24", // amber-400 — string literals
  brace:   "#a3a3a3", // neutral-400 — JSX braces
  punct:   "#737373", // neutral-500 — < > / =
  comment: "#6b7280", // neutral-500
  text:    "#e5e5e5", // neutral-200 — default text
};

export function tokenizeJsx(code) {
  const tokens = [];
  let mode = "text"; // 'text' | 'tag'
  const push = (text, type) => {
    if (!text) return;
    const last = tokens[tokens.length - 1];
    if (last && last.type === type) {
      last.text += text;
    } else {
      tokens.push({ text, type });
    }
  };

  let i = 0;
  const n = code.length;
  while (i < n) {
    const c = code[i];
    const c2 = code[i + 1] || "";
    const c3 = code[i + 2] || "";

    if (mode === "text") {
      // JSX comment {/* ... */}
      if (c === "{" && c2 === "/" && c3 === "*") {
        const end = code.indexOf("*/}", i);
        if (end >= 0) {
          push(code.slice(i, end + 3), "comment");
          i = end + 3;
          continue;
        }
      }
      // Tag start <Name or </Name
      if (c === "<" && /[A-Za-z/]/.test(c2)) {
        if (c2 === "/") {
          push("</", "punct");
          i += 2;
        } else {
          push("<", "punct");
          i++;
        }
        let name = "";
        while (i < n && /[\w.-]/.test(code[i])) {
          name += code[i];
          i++;
        }
        push(name, "tag");
        mode = "tag";
        continue;
      }
      // JSX brace
      if (c === "{" || c === "}") {
        push(c, "brace");
        i++;
        continue;
      }
      push(c, "text");
      i++;
      continue;
    }

    // mode === 'tag' (inside a tag, parsing attrs / closing)
    // String literal value
    if (c === '"' || c === "'") {
      const quote = c;
      let str = c;
      let j = i + 1;
      while (j < n && code[j] !== quote && code[j] !== "\n") {
        str += code[j];
        j++;
      }
      if (j < n && code[j] === quote) {
        str += code[j];
        j++;
      }
      push(str, "string");
      i = j;
      continue;
    }
    // Self-closing /> or end >
    if (c === "/" && c2 === ">") {
      push("/>", "punct");
      i += 2;
      mode = "text";
      continue;
    }
    if (c === ">") {
      push(">", "punct");
      i++;
      mode = "text";
      continue;
    }
    if (c === "=") {
      push("=", "punct");
      i++;
      continue;
    }
    if (c === "{" || c === "}") {
      push(c, "brace");
      i++;
      continue;
    }
    // Attribute name (identifier)
    if (/[A-Za-z_]/.test(c)) {
      let name = "";
      while (i < n && /[\w-]/.test(code[i])) {
        name += code[i];
        i++;
      }
      push(name, "attr");
      continue;
    }
    push(c, "text");
    i++;
  }
  return tokens;
}
