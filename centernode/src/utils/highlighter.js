
// =============================================================
export const JS_KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "do", "switch", "case", "default", "break", "continue", "throw", "try",
  "catch", "finally", "new", "delete", "typeof", "instanceof", "in", "of",
  "import", "export", "from", "as", "async", "await", "class", "extends",
  "super", "this", "null", "undefined", "true", "false", "void", "yield",
]);

export const JS_BUILTINS = new Set([
  "useState", "useEffect", "useRef", "useCallback", "useMemo",
  "React", "Fragment", "h", "Object", "Array", "Math", "JSON", "console",
  "setTimeout", "setInterval", "Promise", "String", "Number", "Boolean",
]);

export const TOKEN_COLORS = {
  comment: "#6b7280",
  string: "#059669",
  number: "#d97706",
  keyword: "#7c3aed",
  builtin: "#2563eb",
  type: "#0891b2",
  func: "#2563eb",
  ident: "#171717",
  punct: "#525252",
  op: "#dc2626",
  text: "#171717",
};

// Tokenize line into spans with highlight classes
export function highlightCode(code) {
  // Basic tokenizer — handles: strings, template literals, comments, keywords, numbers, operators
  const tokens = [];
  let i = 0;
  const len = code.length;

  while (i < len) {
    const c = code[i];

    // Line comment
    if (c === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      const stop = end === -1 ? len : end;
      tokens.push({ type: "comment", text: code.substring(i, stop) });
      i = stop;
      continue;
    }

    // Block comment
    if (c === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2);
      const stop = end === -1 ? len : end + 2;
      tokens.push({ type: "comment", text: code.substring(i, stop) });
      i = stop;
      continue;
    }

    // Strings (single/double/template)
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      let j = i + 1;
      while (j < len) {
        if (code[j] === "\\") { j += 2; continue; }
        if (code[j] === quote) { j++; break; }
        j++;
      }
      tokens.push({ type: "string", text: code.substring(i, j) });
      i = j;
      continue;
    }

    // Number
    if (/[0-9]/.test(c)) {
      let j = i + 1;
      while (j < len && /[0-9.]/.test(code[j])) j++;
      tokens.push({ type: "number", text: code.substring(i, j) });
      i = j;
      continue;
    }

    // Identifier or keyword
    if (/[a-zA-Z_$]/.test(c)) {
      let j = i + 1;
      while (j < len && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.substring(i, j);
      let type = "ident";
      if (JS_KEYWORDS.has(word)) type = "keyword";
      else if (JS_BUILTINS.has(word)) type = "builtin";
      else if (/^[A-Z]/.test(word)) type = "type";
      // Check if it's a function call (followed by `(`)
      else if (code[j] === "(") type = "func";
      tokens.push({ type, text: word });
      i = j;
      continue;
    }

    // Punctuation
    if (/[{}()\[\],.;:]/.test(c)) {
      tokens.push({ type: "punct", text: c });
      i++;
      continue;
    }

    // Operators
    if (/[+\-*/=<>!&|%^~?]/.test(c)) {
      let j = i + 1;
      while (j < len && /[+\-*/=<>!&|%^~?]/.test(code[j])) j++;
      tokens.push({ type: "op", text: code.substring(i, j) });
      i = j;
      continue;
    }

    // Whitespace / anything else
    tokens.push({ type: "text", text: c });
    i++;
  }

  return tokens;
}
