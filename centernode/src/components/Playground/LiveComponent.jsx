
import { useState, useEffect, useRef, useCallback, useMemo, createElement, Fragment } from "react";
const h = createElement;

export default function LiveComponent({ code, componentName, props, registry }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const codeWithoutComments = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "").trim();
      const isHtmlCode = codeWithoutComments.startsWith("<");
      let executableCode = code;
      let targetName = componentName;

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

      // Build argument list: standard scope + all registered components
      const registryNames = registry ? Object.keys(registry) : [];
      const registryValues = registry ? Object.values(registry) : [];

      // eslint-disable-next-line no-new-func
      const factory = new Function(
        "React", "h", "useState", "useEffect", "useRef", "useCallback", "useMemo", "Fragment",
        ...registryNames,
        `${executableCode}\nreturn typeof ${targetName} !== "undefined" ? ${targetName} : null;`
      );
      const Comp = factory(
        { createElement, Fragment },
        h,
        useState, useEffect, useRef, useCallback, useMemo, Fragment,
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
