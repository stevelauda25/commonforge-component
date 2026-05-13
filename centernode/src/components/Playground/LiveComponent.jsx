
import { useState, useEffect, useRef, useCallback, useMemo, createElement, Fragment } from "react";
import { POD_SCOPE_NAMES, POD_SCOPE_VALUES, transformIfJSX } from "@/utils/podRuntime";
const h = createElement;

export default function LiveComponent({ code, componentName, props, registry }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const codeWithoutComments = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").trim();
      // HTML = starts with lowercase tag (`<div`, `<html`) or doctype (`<!DOCTYPE`).
      // JSX  = starts with uppercase tag (`<Button`, `<MyCard`). Order matters:
      // check JSX FIRST so it never falls through to the HTML iframe branch.
      const isJsxSnippet = /^<[A-Z]/.test(codeWithoutComments);
      const isHtmlCode = !isJsxSnippet && codeWithoutComments.startsWith("<");
      let executableCode = code;
      let targetName = componentName;

      if (isJsxSnippet) {
        // Wrap JSX snippet as a Component function, then transpile JSX → h().
        executableCode = `function ${componentName || "Snippet"}() { return (\n${code}\n); }`;
        targetName = componentName || "Snippet";
        executableCode = transformIfJSX(executableCode);
      } else if (!isHtmlCode) {
        // User-authored function code (may contain inline JSX). Strip TS + JSX.
        executableCode = transformIfJSX(executableCode);
      }
      // NOTE: HTML branch is intentionally skipped for transformIfJSX.
      // The raw HTML contains `<html lang=…>`, `<meta charset=…>` etc. which
      // JSX_HINT would falsely flag — sending it through Sucrase blows up
      // because HTML is not valid JSX. HtmlWrapper builds an iframe via h()
      // calls (no JSX inside), so transform is unnecessary anyway.

      if (isHtmlCode) {
        const escapedHtml = code.replace(/`/g, "\\`").replace(/\$/g, "\\$");
        executableCode = `
          function HtmlWrapper(props) {
            const frameId = useMemo(() => Math.random().toString(36).substring(2, 11), []);
            
            const srcDoc = useMemo(() => {
              let html = \`${escapedHtml}\`;
              
              if (props) {
                // 1. Replace {{ varName }}
                const textVarRegex = /\\{\\{\\s*([a-zA-Z0-9_-]+)(?:\\s*:\\s*([^}]+))?\\s*\\}\\}/g;
                html = html.replace(textVarRegex, (match, key, def) => {
                  return props[key] !== undefined ? props[key] : (def ? def.replace(/^["']|["']$/g, "").trim() : "");
                });
                
                // 2. Inject CSS Variables
                const cssProps = Object.keys(props).filter(k => k.startsWith("--"));
                if (cssProps.length > 0) {
                  let cssOverrides = ":root { ";
                  cssProps.forEach(k => {
                    cssOverrides += \`\${k}: \${props[k]} !important; \`;
                  });
                  cssOverrides += "}";
                  
                  // Inject before </body> or just append
                  if (html.includes("</body>")) {
                    html = html.replace("</body>", \`<style>\${cssOverrides}</style></body>\`);
                  } else {
                    html += \`\n<style>\${cssOverrides}</style>\`;
                  }
                }
              }

              // Inject scripts
              const scripts = \`
                <script>
                  window.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    const rect = window.frameElement ? window.frameElement.getBoundingClientRect() : { left: 0, top: 0 };
                    window.parent.postMessage({
                      type: 'canvas-wheel',
                      frameId: "\${frameId}",
                      deltaX: e.deltaX,
                      deltaY: e.deltaY,
                      clientX: e.clientX + rect.left,
                      clientY: e.clientY + rect.top,
                      ctrlKey: e.ctrlKey,
                      metaKey: e.metaKey
                    }, '*');
                  }, { passive: false });

                  window.addEventListener('mousemove', (e) => {
                    const target = e.target;
                    if (!target || target === document.body || target === document.documentElement) {
                      window.parent.postMessage({ type: 'canvas-measure', frameId: "\${frameId}", info: null }, '*');
                      return;
                    }
                    const rect = target.getBoundingClientRect();
                    const styles = window.getComputedStyle(target);
                    
                    window.parent.postMessage({
                      type: 'canvas-measure',
                      frameId: "\${frameId}",
                      info: {
                        tag: target.tagName.toLowerCase(),
                        x: rect.left,
                        y: rect.top,
                        width: Math.round(rect.width),
                        height: Math.round(rect.height),
                        padding: styles.padding,
                        margin: styles.margin,
                        borderRadius: styles.borderRadius,
                        background: styles.backgroundColor,
                        color: styles.color,
                        fontSize: styles.fontSize,
                        fontWeight: styles.fontWeight,
                        display: styles.display,
                      }
                    }, '*');
                  });

                  window.addEventListener('mouseleave', () => {
                    window.parent.postMessage({ type: 'canvas-measure', frameId: "\${frameId}", info: null }, '*');
                  });
                </script>\`;

              if (html.includes("</body>")) {
                return html.replace("</body>", \`\${scripts}</body>\`);
              }
              return html + scripts;
            }, [props]);

            return h('iframe', { 
              'data-frame-id': frameId,
              srcDoc: srcDoc,
              style: { width: "100%", height: "100%", border: "none" },
              sandbox: "allow-scripts allow-same-origin allow-popups"
            });
          }
        `;
        targetName = "HtmlWrapper";
      }

      // Build argument list: standard scope + POD design system + all user-registered components.
      // Strict-mode `new Function` rejects duplicate identifiers — if the user code
      // declares `function Button() {}` or the registry already has a `Button`, we
      // can't also inject POD's `Button` as a scope param. Filter conflicts out;
      // user code wins (they explicitly shadowed POD).
      const registryNames = registry ? Object.keys(registry) : [];
      const registryValues = registry ? Object.values(registry) : [];
      const userDeclaredNames = new Set([
        ...registryNames,
        ...Array.from(executableCode.matchAll(/function\s+([A-Z]\w*)\s*\(/g)).map((m) => m[1]),
      ]);
      const podScopeNames = [];
      const podScopeValues = [];
      for (let i = 0; i < POD_SCOPE_NAMES.length; i++) {
        if (userDeclaredNames.has(POD_SCOPE_NAMES[i])) continue;
        podScopeNames.push(POD_SCOPE_NAMES[i]);
        podScopeValues.push(POD_SCOPE_VALUES[i]);
      }

      // eslint-disable-next-line no-new-func
      const factory = new Function(
        "React", "h", "useState", "useEffect", "useRef", "useCallback", "useMemo", "Fragment",
        ...podScopeNames,
        ...registryNames,
        `${executableCode}\nreturn typeof ${targetName} !== "undefined" ? ${targetName} : null;`
      );
      const Comp = factory(
        { createElement, Fragment },
        h,
        useState, useEffect, useRef, useCallback, useMemo, Fragment,
        ...podScopeValues,
        ...registryValues
      );
      if (typeof Comp !== "function") {
        setError(`Component "${componentName}" is not defined. Make sure your function name starts with a capital letter.`);
        setComponent(null);
        return;
      }
      setComponent(() => Comp);
      setError(null);
    } catch (e) {
      setError(e.message);
      setComponent(null);
    }
  }, [code, componentName, registry]);

  if (error) {
    return h("div", { className: "text-[10px] text-red-600 font-mono max-w-[260px]" },
      h("div", { className: "font-semibold mb-0.5" }, "Error"),
      h("div", { className: "opacity-80 line-clamp-4 leading-relaxed" }, error)
    );
  }
  if (!Component) return null;
  try {
    return h(Component, props || {});
  } catch (e) {
    return h("div", { className: "text-[10px] text-red-600 font-mono" },
      h("div", { className: "font-semibold mb-0.5" }, "Render error"),
      h("div", { className: "opacity-80" }, e.message)
    );
  }
}
