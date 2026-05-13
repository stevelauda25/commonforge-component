"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback, createElement, Fragment } from "react";
import {
  Plus, Download, Upload, Trash2, Copy, Code2, X, ZoomIn, ZoomOut, Maximize2,
  Sparkles, ChevronLeft, Check, MousePointer2, Hand, Palette,
  Smartphone, Tablet, Monitor, Frame, SlidersHorizontal, RotateCcw, FileCode, Info,
  Layers, Ruler, Package,
} from "lucide-react";
import { DEFAULT_TOKENS, FRAME_PRESETS, TEMPLATES, DEMO_CODE } from "@/constants/playground";
import { parseSchemaFromCode, extractComponentName, updateCodeWithProp, isJsxSnippet, extractJsxTag, parseJsxSnippetSchema } from "@/utils/parser";
import { tokensToCSS, tokensToTailwind, nodeToJSXFile, downloadFile } from "@/utils/exportHelpers";
import { POD_SCOPE_NAMES, POD_SCOPE_VALUES, transformIfJSX, canvasManifest } from "@/utils/podRuntime";
import { POD_DEFAULT_TOKENS, podTokensToCSS } from "@/utils/podTokens";
import CodeEditor from "./CodeEditor";
import LiveComponent from "./LiveComponent";
import PropInput from "./PropInput";
import PreviewNode from "./PreviewNode";
import MeasureOverlay from "./MeasureOverlay";
import ResizeHandles from "./ResizeHandles";
import TokenEditor from "./TokenEditor";
import SizeInput from "./SizeInput";
import PodLibraryPanel from "./PodLibraryPanel";

const h = createElement;

// =============================================================
// Inject `:root { --color-* }` overrides for POD design system tokens.
// These override pod-test-tokens/theme.css at runtime, so every POD component
// on the canvas (Button, Checkbox, TextInput…) reflects the change instantly.
export function usePodTokensCSS(tokens) {
  useEffect(() => {
    let styleEl = document.getElementById("playground-pod-tokens");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "playground-pod-tokens";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = podTokensToCSS(tokens);
  }, [tokens]);
}

// =============================================================
export function useGlobalTokensCSS(tokens) {
  useEffect(() => {
    let styleEl = document.getElementById("playground-global-tokens");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "playground-global-tokens";
      document.head.appendChild(styleEl);
    }
    let css = ":root {";
    for (const [category, values] of Object.entries(tokens)) {
      for (const [key, val] of Object.entries(values)) {
        css += `--token-${category}-${key}: ${val};`;
      }
    }
    css += "}";
    // inside stretch to fill that width. Works regardless of whether the user's
    // component code sets width:100% explicitly or not.
    // Using double class (.pg-stretch-child.pg-stretch-child) for specificity boost.
    css += `
      .pg-stretch-child-w.pg-stretch-child-w > * {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      .pg-stretch-child-h.pg-stretch-child-h > * {
        height: 100% !important;
        max-height: 100% !important;
        box-sizing: border-box !important;
      }
      .pg-stretch-child-w.pg-stretch-child-w > button,
      .pg-stretch-child-w.pg-stretch-child-w > input,
      .pg-stretch-child-w.pg-stretch-child-w > textarea,
      .pg-stretch-child-w.pg-stretch-child-w > select,
      .pg-stretch-child-w.pg-stretch-child-w > a {
        display: block !important;
      }
      .is-panning iframe,
      .is-resizing iframe,
      .space-held iframe {
        pointer-events: none !important;
      }
    `;
    styleEl.textContent = css;
  }, [tokens]);
}

// =============================================================
export default function ComponentPlayground() {
  const [initialized, setInitialized] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [globalTokens, setGlobalTokens] = useState(DEFAULT_TOKENS);
  const [globalPodTokens, setGlobalPodTokens] = useState(POD_DEFAULT_TOKENS);
  const [tokensPanelOpen, setTokensPanelOpen] = useState(false);
  const [tokensTab, setTokensTab] = useState("pod"); // "pod" | "legacy"
  const [inspectorTab, setInspectorTab] = useState("props");
  const [showSyntaxHint, setShowSyntaxHint] = useState(false);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [spaceHeld, setSpaceHeld] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [measureMode, setMeasureMode] = useState(false);
  const canvasRef = useRef(null);
  const addMenuRef = useRef(null);
  const exportMenuRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState("");

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Build component registry — compile each node's code into a callable component
  // We only depend on the id and code of nodes, so dragging/resizing doesn't rebuild the registry
  const nodesCodeSignature = nodes.map(n => n.id + ":" + n.code).join("||");
  const registry = useMemo(() => {
    const reg = {};
    for (const node of nodes) {
      // JSX snippet nodes (POD instances) — they USE a component, don't DEFINE one.
      // Skip — they don't contribute to the registry.
      if (isJsxSnippet(node.code)) continue;
      const name = extractComponentName(node.code);
      if (!name || name === "Component") continue; // skip generic / unnamed
      try {
        const transformed = transformIfJSX(node.code);
        // Skip POD scope params that would clash with a function declared in user code.
        const userNames = new Set(
          Array.from(transformed.matchAll(/function\s+([A-Z]\w*)\s*\(/g)).map((m) => m[1])
        );
        const podNames = [];
        const podValues = [];
        for (let i = 0; i < POD_SCOPE_NAMES.length; i++) {
          if (userNames.has(POD_SCOPE_NAMES[i])) continue;
          podNames.push(POD_SCOPE_NAMES[i]);
          podValues.push(POD_SCOPE_VALUES[i]);
        }
        // eslint-disable-next-line no-new-func
        const factory = new Function(
          "React", "h", "useState", "useEffect", "useRef", "useCallback", "useMemo", "Fragment",
          ...podNames,
          `${transformed}\nreturn typeof ${name} !== "undefined" ? ${name} : null;`
        );
        const Comp = factory(
          { createElement, Fragment },
          h,
          useState, useEffect, useRef, useCallback, useMemo, Fragment,
          ...podValues,
        );
        if (typeof Comp === "function") {
          reg[name] = Comp;
        }
      } catch {
        // Skip nodes that fail to compile — they're being edited
      }
    }
    return reg;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodesCodeSignature]);

  useGlobalTokensCSS(globalTokens);
  usePodTokensCSS(globalPodTokens);

  const updateGlobalPodToken = (category, key, value) => {
    setGlobalPodTokens((prev) => ({
      ...prev,
      [category]: { ...(prev[category] || {}), [key]: value },
    }));
  };
  const resetPodTokens = () => setGlobalPodTokens(POD_DEFAULT_TOKENS);

  useEffect(() => {
    (async () => {
      try {
        const saved = await window.storage?.get("playground:v20");
        if (saved?.value) {
          const data = JSON.parse(saved.value);
          // Sanity: reset any node with broken customSize
          const safeNodes = (data.nodes || [])
            .filter((n) => n.id !== "demo" && n.code !== DEMO_CODE)
            .map((n) => {
            let wMode = "fixed";
            let hMode = "auto";
            let wVal = 400;
            let hVal = 200;

            if (n.customSize) {
              wVal = typeof n.customSize.width === "number" ? Math.max(40, n.customSize.width) : wVal;
              wMode = n.customSize.widthMode || n.customSize.mode || "fixed";
              hVal = typeof n.customSize.height === "number" ? Math.max(24, n.customSize.height) : hVal;
              hMode = n.customSize.heightMode || (n.customSize.height === "auto" ? "auto" : "fixed");
            } else if (n.frame && n.frame !== "custom" && n.frame !== "auto") {
              const preset = FRAME_PRESETS[n.frame];
              if (preset && preset.width) {
                wVal = preset.width;
                hVal = preset.height;
                hMode = "fixed";
              }
            } else if (n.frame === "auto") {
              wMode = "auto";
              hMode = "auto";
            }
            
            // Re-parse schema so new parser logic applies to old nodes
            const reParsedSchema = isJsxSnippet(n.code)
              ? parseJsxSnippetSchema(n.code, canvasManifest.components.find((c) => c.name === extractJsxTag(n.code)))
              : parseSchemaFromCode(n.code);
            const mergedProps = { ...n.props };
            for (const [k, v] of Object.entries(reParsedSchema)) {
              if (!(k in mergedProps)) mergedProps[k] = v.default;
            }
            
            return {
              ...n,
              frame: undefined,
              schema: reParsedSchema,
              props: mergedProps,
              customSize: { width: wVal, widthMode: wMode, height: hVal, heightMode: hMode }
            };
          });
          setNodes(safeNodes);
          if (data.globalTokens) setGlobalTokens(data.globalTokens);
          setInitialized(true);
          return;
        }
      } catch {}
      // Empty canvas by default — user picks from POD Library or "Add component".
      // No auto-spawn (DEMO_CODE removed; its `function Button` shadowed POD scope).
      setNodes([]);
      setInitialized(true);
    })();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const t = setTimeout(async () => {
      try {
        await window.storage?.set("playground:v20", JSON.stringify({ nodes, globalTokens }));
        if (nodes.length > 0) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus(""), 1500);
        }
      } catch {}
    }, 800);
    return () => clearTimeout(t);
  }, [nodes, globalTokens, initialized]);

  const addNode = (templateKey = "blank") => {
    const template = TEMPLATES[templateKey] || TEMPLATES.blank;
    const id = `n${Date.now()}`;
    const cx = (-pan.x + (canvasRef.current?.clientWidth || 800) / 2) / zoom;
    const cy = (-pan.y + (canvasRef.current?.clientHeight || 600) / 2) / zoom;
    const schema = parseSchemaFromCode(template.code);
    const props = {};
    for (const [k, v] of Object.entries(schema)) props[k] = v.default;
    const newNode = {
      id,
      name: `${template.name.toLowerCase()}-${nodes.length + 1}`,
      code: template.code,
      schema,
      props,
      customSize: template.defaultSize || { width: 400, widthMode: "auto", height: 200, heightMode: "auto" },
      tokenOverrides: {},
      x: cx - 80, y: cy - 60,
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(id);
  };

  // Spawn a node from a POD canvasManifest pick (variant × size cell or example).
  // Emits a single-line JSX snippet — LiveComponent transpiles via sucrase at render.
  const addPodNode = ({ componentName, code }) => {
    const id = `n${Date.now()}`;
    const cx = (-pan.x + (canvasRef.current?.clientWidth || 800) / 2) / zoom;
    const cy = (-pan.y + (canvasRef.current?.clientHeight || 600) / 2) / zoom;
    const manifestEntry = canvasManifest.components.find((c) => c.name === componentName);
    const schema = parseJsxSnippetSchema(code, manifestEntry);
    const props = {};
    for (const [k, v] of Object.entries(schema)) props[k] = v.default;
    const newNode = {
      id,
      name: `${componentName.toLowerCase()}-${nodes.length + 1}`,
      code,
      schema,
      props,
      customSize: { width: 240, widthMode: "auto", height: 80, heightMode: "auto" },
      tokenOverrides: {},
      x: cx - 80,
      y: cy - 40,
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(id);
  };

  const updateNode = (id, updates) => setNodes((p) => p.map((n) => n.id === id ? { ...n, ...updates } : n));
  const updateNodeProp = (id, k, v) => setNodes((p) => p.map((n) => {
    if (n.id === id) {
      const newCode = updateCodeWithProp(n.code, k, v);
      return { ...n, code: newCode, props: { ...n.props, [k]: v } };
    }
    return n;
  }));
  const updateNodeCode = (id, newCode) => {
    const newSchema = isJsxSnippet(newCode)
      ? parseJsxSnippetSchema(newCode, canvasManifest.components.find((c) => c.name === extractJsxTag(newCode)))
      : parseSchemaFromCode(newCode);
    setNodes((p) => p.map((n) => {
      if (n.id !== id) return n;
      const newProps = { ...n.props };
      for (const [k, v] of Object.entries(newSchema)) if (!(k in newProps)) newProps[k] = v.default;
      for (const k of Object.keys(newProps)) if (!(k in newSchema)) delete newProps[k];
      return { ...n, code: newCode, schema: newSchema, props: newProps };
    }));
  };
  const updateNodeTokenOverride = (id, category, key, value) => {
    setNodes((p) => p.map((n) => {
      if (n.id !== id) return n;
      const overrides = { ...(n.tokenOverrides || {}) };
      if (!overrides[category]) overrides[category] = {};
      if (value === undefined) {
        delete overrides[category][key];
        if (Object.keys(overrides[category]).length === 0) delete overrides[category];
      } else {
        overrides[category] = { ...overrides[category], [key]: value };
      }
      return { ...n, tokenOverrides: overrides };
    }));
  };
  const deleteNode = (id) => {
    setNodes((p) => p.filter((n) => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };
  const duplicateNode = (id) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    const newId = `n${Date.now()}`;
    setNodes([...nodes, { ...node, id: newId, name: `${node.name}-copy`, x: node.x + 40, y: node.y + 40 }]);
    setSelectedNodeId(newId);
  };

  // Close add menu on click outside
  useEffect(() => {
    if (!addMenuOpen) return;
    const handler = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setAddMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [addMenuOpen]);

  // Close export menu on click outside
  useEffect(() => {
    if (!exportMenuOpen) return;
    const handler = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [exportMenuOpen]);

  useEffect(() => {
    const down = (e) => {
      const isInput = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
      if (e.code === "Space" && !spaceHeld && !isInput) {
        e.preventDefault();
        setSpaceHeld(true);
        document.body.classList.add("space-held");
      }
      if (e.key === "d" && selectedNodeId && !isInput) duplicateNode(selectedNodeId);
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId && !isInput) deleteNode(selectedNodeId);
      if (e.key === "Escape") { setSelectedNodeId(null); setAddMenuOpen(false); }
      if (e.key === "0" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setZoom(1); setPan({ x: 0, y: 0 });
      }
    };
    const up = (e) => {
      if (e.code === "Space") {
        setSpaceHeld(false);
        document.body.classList.remove("space-held");
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [spaceHeld, selectedNodeId, nodes]);

  const handleCanvasMouseDown = (e) => {
    const isCanvasBg = e.target === canvasRef.current || e.target.classList?.contains("canvas-bg");
    const isPan = spaceHeld || e.button === 1 || isCanvasBg;
    if (!isPan) return;
    if (isCanvasBg && !spaceHeld) setSelectedNodeId(null);
    const startX = e.clientX - pan.x;
    const startY = e.clientY - pan.y;
    document.body.classList.add("is-panning");
    const handleMove = (ev) => setPan({ x: ev.clientX - startX, y: ev.clientY - startY });
    const handleUp = () => {
      document.body.classList.remove("is-panning");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (e.ctrlKey || e.metaKey) {
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const worldX = (cx - pan.x) / zoom;
      const worldY = (cy - pan.y) / zoom;
      const newZoom = Math.max(0.1, Math.min(4, zoom * (1 + -e.deltaY * 0.01)));
      setZoom(newZoom);
      setPan({ x: cx - worldX * newZoom, y: cy - worldY * newZoom });
    } else {
      setPan((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  }, [zoom, pan]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    
    // Listen for wheel events forwarded from iframes
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'canvas-wheel') {
        const ev = {
          preventDefault: () => {},
          clientX: e.data.clientX,
          clientY: e.data.clientY,
          deltaX: e.data.deltaX,
          deltaY: e.data.deltaY,
          ctrlKey: e.data.ctrlKey,
          metaKey: e.data.metaKey
        };
        handleWheel(ev);
      }
    };
    window.addEventListener("message", handleMessage);
    
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("message", handleMessage);
    };
  }, [handleWheel]);

  const handleExport = () => {
    const data = { nodes, globalTokens };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "playground.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.nodes) setNodes(data.nodes);
        if (data.globalTokens) setGlobalTokens(data.globalTokens);
      } catch { alert("Invalid file"); }
    };
    reader.readAsText(file);
  };

  const updateGlobalToken = (category, key, value) => {
    setGlobalTokens((prev) => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
  };

  if (!initialized) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-neutral-50 text-neutral-900 overflow-hidden" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* TOP BAR */}
      <header className="h-12 border-b border-neutral-200 bg-white flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-[5px] bg-neutral-900 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">Playground</span>
          </div>
          <span className="text-neutral-300">/</span>
          <span className="text-[11px] text-neutral-400">{nodes.length} component{nodes.length !== 1 ? "s" : ""}</span>
          {saveStatus && (
            <span className="text-[10px] text-green-600 font-medium ml-1 flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSyntaxHint(!showSyntaxHint)}
            className="text-xs text-neutral-600 hover:bg-neutral-100 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            Syntax
          </button>
          <button
            onClick={() => setTokensPanelOpen(!tokensPanelOpen)}
            className={`text-xs px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              tokensPanelOpen ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Tokens
          </button>
          <div className="w-px h-5 bg-neutral-200 mx-1" />
          <label className="text-xs text-neutral-600 hover:bg-neutral-100 px-2.5 py-1.5 rounded-md cursor-pointer flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Import
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <div ref={exportMenuRef} className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className={`text-xs text-neutral-600 hover:bg-neutral-100 px-2.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                exportMenuOpen ? "bg-neutral-100" : ""
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            {exportMenuOpen && (
              <div className="absolute top-full mt-1 right-0 w-[280px] bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden z-50">
                <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50/50">
                  <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Handoff</div>
                </div>
                <div className="p-1.5">
                  {selectedNode && (
                    <button
                      onClick={() => {
                        downloadFile(
                          `${selectedNode.name}.jsx`,
                          nodeToJSXFile(selectedNode),
                          "text/javascript"
                        );
                        setExportMenuOpen(false);
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                        <FileCode className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-neutral-900">Selected as JSX</div>
                        <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                          {selectedNode.name}.jsx — paste-ready React
                        </div>
                      </div>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const all = nodes.map((n) => `// ${n.name}\n${nodeToJSXFile(n)}`).join("\n\n// ==========\n\n");
                      downloadFile("components.jsx", all, "text/javascript");
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-neutral-900">All components as JSX</div>
                      <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                        components.jsx — all {nodes.length} components in one file
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      downloadFile("tokens.css", tokensToCSS(globalTokens), "text/css");
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center shrink-0">
                      <Palette className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-neutral-900">Tokens as CSS</div>
                      <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                        tokens.css — import into your stylesheet
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      downloadFile("tailwind.tokens.js", tokensToTailwind(globalTokens), "text/javascript");
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-violet-50 flex items-center justify-center shrink-0">
                      <Palette className="w-3.5 h-3.5 text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-neutral-900">Tokens as Tailwind</div>
                      <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                        tailwind.tokens.js — merge into config
                      </div>
                    </div>
                  </button>
                </div>
                <div className="px-3 py-2 border-t border-neutral-100 bg-neutral-50/50">
                  <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Project</div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      const data = { nodes, globalTokens };
                      downloadFile("playground.json", JSON.stringify(data, null, 2), "application/json");
                      setExportMenuOpen(false);
                    }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-md bg-neutral-100 flex items-center justify-center shrink-0">
                      <Download className="w-3.5 h-3.5 text-neutral-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-neutral-900">Backup as JSON</div>
                      <div className="text-[10px] text-neutral-500 leading-snug mt-0.5">
                        Re-import later to restore state
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <PodLibraryPanel manifest={canvasManifest} onAddPodNode={addPodNode} />
        {tokensPanelOpen && (
          <div className="w-[300px] border-r border-neutral-200 bg-white flex flex-col shrink-0 z-20">
            <div className="h-9 px-3 flex items-center gap-2 border-b border-neutral-200 bg-neutral-50/50">
              <Palette className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">Global Tokens</span>
              <button onClick={() => setTokensPanelOpen(false)} className="ml-auto p-1 hover:bg-neutral-200 rounded transition-colors">
                <ChevronLeft className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </div>
            <div className="flex border-b border-neutral-200 bg-neutral-50/50">
              <button
                onClick={() => setTokensTab("pod")}
                className={`flex-1 px-3 py-2 text-[11px] font-semibold transition-colors ${
                  tokensTab === "pod"
                    ? "text-neutral-900 border-b-2 border-neutral-900 -mb-px"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                POD Design System
              </button>
              <button
                onClick={() => setTokensTab("legacy")}
                className={`flex-1 px-3 py-2 text-[11px] font-semibold transition-colors ${
                  tokensTab === "legacy"
                    ? "text-neutral-900 border-b-2 border-neutral-900 -mb-px"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                Component
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {tokensTab === "pod" ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] text-neutral-500">Live override of pod-test-tokens</span>
                    <button
                      onClick={resetPodTokens}
                      className="text-[10px] text-neutral-500 hover:text-neutral-900 underline"
                    >
                      Reset all
                    </button>
                  </div>
                  <TokenEditor tokens={globalPodTokens} onChange={updateGlobalPodToken} />
                  <div className="text-[10px] text-neutral-400 leading-relaxed pt-4 mt-4 border-t border-neutral-200">
                    In code: <span className="font-mono text-neutral-600">var(--color-accent-default)</span>
                  </div>
                </>
              ) : (
                <>
                  <TokenEditor tokens={globalTokens} onChange={updateGlobalToken} />
                  <div className="text-[10px] text-neutral-400 leading-relaxed pt-4 mt-4 border-t border-neutral-200">
                    In code: <span className="font-mono text-neutral-600">var(--token-colors-brand)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div
          ref={canvasRef}
          className={`canvas-bg flex-1 relative overflow-hidden ${spaceHeld ? "cursor-grab active:cursor-grabbing" : ""}`}
          style={{
            // Dot pattern stays constant in screen space (doesn't zoom with content)
            backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
            backgroundSize: `24px 24px`,
            backgroundPosition: `${pan.x % 24}px ${pan.y % 24}px`,
          }}
          onMouseDown={handleCanvasMouseDown}
        >
          {/* Outer layer: pan (screen-space translate) */}
          <div
            className="absolute top-0 left-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: "0 0",
              willChange: "transform",
            }}
          >
            {/* Inner layer: zoom (re-renders DOM at new size, keeps text crisp) */}
            <div
              style={{
                zoom: zoom,
              }}
            >
            {nodes.map((node) => {
              return (
                <PreviewNode
                  key={node.id}
                  node={node}
                  selected={selectedNodeId === node.id}
                  onUpdate={updateNode}
                  onDelete={deleteNode}
                  onDuplicate={duplicateNode}
                  onSelect={setSelectedNodeId}
                  registry={registry}
                  measureMode={measureMode}
                  zoom={zoom}
                />
              );
            })}
            </div>
          </div>

          <div ref={addMenuRef} className="absolute top-4 left-4 z-10">
            <button
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className={`bg-neutral-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-sm hover:bg-neutral-800 flex items-center gap-1.5 transition-all ${
                addMenuOpen ? "ring-2 ring-neutral-900/20 ring-offset-2" : ""
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Add component
            </button>

            {addMenuOpen && (
              <div className="absolute top-full mt-2 left-0 w-[300px] bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50/50">
                  <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Start with</div>
                </div>
                <div className="p-1.5 max-h-[400px] overflow-y-auto">
                  {Object.entries(TEMPLATES).map(([key, tpl]) => (
                    <button
                      key={key}
                      onClick={() => { addNode(key); setAddMenuOpen(false); }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-neutral-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 rounded-md bg-neutral-100 flex items-center justify-center shrink-0 text-neutral-500 text-lg font-light group-hover:bg-white group-hover:shadow-sm transition-all">
                        {tpl.icon}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="text-[13px] font-semibold text-neutral-900 leading-tight">{tpl.name}</div>
                        <div className="text-[11px] text-neutral-500 leading-snug mt-0.5">{tpl.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center max-w-sm px-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <Package className="w-5 h-5 text-neutral-400" />
                </div>
                <div className="text-sm text-neutral-700 font-medium mb-1">Canvas is empty</div>
                <div className="text-[11px] text-neutral-500 leading-relaxed">
                  Pick a component from the <span className="font-semibold text-neutral-700">POD Components</span> sidebar on the left.
                </div>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex items-center gap-0.5 bg-white border border-neutral-200 rounded-lg shadow-sm p-1">
            <button
              onClick={() => setMeasureMode(!measureMode)}
              className={`p-1.5 rounded transition-colors ${
                measureMode ? "bg-pink-50 text-pink-600 hover:bg-pink-100" : "hover:bg-neutral-100 text-neutral-600"
              }`}
              title="Measure mode — hover elements to inspect"
            >
              <Ruler className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-neutral-200 mx-0.5" />
            <button onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))} className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
              <ZoomOut className="w-3.5 h-3.5 text-neutral-600" />
            </button>
            <div className="text-[11px] font-mono text-neutral-600 w-10 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </div>
            <button onClick={() => setZoom((z) => Math.min(4, z + 0.1))} className="p-1.5 hover:bg-neutral-100 rounded transition-colors">
              <ZoomIn className="w-3.5 h-3.5 text-neutral-600" />
            </button>
            <div className="w-px h-4 bg-neutral-200 mx-0.5" />
            <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-neutral-100 rounded transition-colors" title="Reset (⌘0)">
              <Maximize2 className="w-3.5 h-3.5 text-neutral-600" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] text-neutral-500 font-mono bg-white/80 backdrop-blur px-2.5 py-1.5 rounded-md border border-neutral-200">
            {measureMode ? (
              <><Ruler className="w-3 h-3 text-pink-600" /> <span className="text-pink-700">measure mode</span> · hover elements</>
            ) : spaceHeld ? (
              <><Hand className="w-3 h-3" /> panning</>
            ) : (
              <><MousePointer2 className="w-3 h-3" /> scroll to pan · ⌘+scroll to zoom</>
            )}
          </div>
        </div>

        <div className="w-[360px] border-l border-neutral-200 bg-white flex flex-col shrink-0 z-20">
          {selectedNode ? (
            <>
              <div className="px-4 py-3 border-b border-neutral-200">
                <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider block mb-1">Component</label>
                <input
                  value={selectedNode.name}
                  onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                  className="w-full text-sm font-medium px-2 py-1 bg-neutral-50 border border-neutral-200 rounded-md focus:border-neutral-400 focus:bg-white outline-none transition-colors"
                />
                <div className="mt-3">
                  <label className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Frame className="w-3 h-3" /> Size
                  </label>
                  {selectedNode.customSize && (
                    <div className="flex gap-1.5 w-full">
                      <SizeInput
                        type="width"
                        value={selectedNode.customSize.width}
                        mode={selectedNode.customSize.widthMode || "fixed"}
                        onChange={(next) => updateNode(selectedNode.id, {
                          customSize: { ...selectedNode.customSize, width: next.value, widthMode: next.mode }
                        })}
                      />
                      <SizeInput
                        type="height"
                        value={selectedNode.customSize.height}
                        mode={selectedNode.customSize.heightMode || "auto"}
                        onChange={(next) => updateNode(selectedNode.id, {
                          customSize: { ...selectedNode.customSize, height: next.value, heightMode: next.mode }
                        })}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center border-b border-neutral-200 bg-neutral-50/50 shrink-0">
                {[
                  { id: "props", icon: SlidersHorizontal, label: "Props" },
                  { id: "code", icon: Code2, label: "Code" },
                  { id: "tokens", icon: Palette, label: "Tokens" },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = inspectorTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setInspectorTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium transition-colors border-b-2 ${
                        active ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-700"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                {inspectorTab === "props" && (
                  <div className="flex-1 overflow-y-auto p-4">
                    {Object.keys(selectedNode.schema || {}).length === 0 ? (
                      <div className="text-[11px] text-neutral-400 italic py-8 text-center">
                        No props defined.<br />
                        <span className="text-neutral-500">
                          Add props to <span className="font-mono">function Component(&#123;...&#125;)</span> in Code tab.
                        </span>
                      </div>
                    ) : (
                      Object.entries(selectedNode.schema).map(([key, s]) => (
                        <PropInput
                          key={key}
                          propKey={key}
                          schema={s}
                          value={selectedNode.props[key] ?? s.default}
                          onChange={(v) => updateNodeProp(selectedNode.id, key, v)}
                        />
                      ))
                    )}
                  </div>
                )}

                {inspectorTab === "code" && (
                  <div className="flex-1 flex flex-col min-h-0">
                    {(() => {
                      const selfName = extractComponentName(selectedNode.code);
                      const available = Object.keys(registry).filter((n) => n !== selfName);
                      if (available.length === 0) return null;
                      return (
                        <div className="px-3 py-2 bg-blue-50/50 border-b border-blue-100 text-[10px] text-blue-900 flex items-start gap-1.5">
                          <Layers className="w-3 h-3 mt-0.5 shrink-0 text-blue-600" />
                          <div className="leading-relaxed">
                            <span className="text-blue-600/70">Compose with: </span>
                            {available.map((name, i) => (
                              <span key={name}>
                                <code className="font-mono font-semibold text-blue-700">{name}</code>
                                {i < available.length - 1 && <span className="text-blue-600/50">, </span>}
                              </span>
                            ))}
                            <span className="text-blue-600/70"> — use </span>
                            <code className="font-mono text-blue-700">h({available[0]}, &#123;...&#125;)</code>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-h-0">
                      <CodeEditor
                        value={selectedNode.code}
                        onChange={(v) => updateNodeCode(selectedNode.id, v)}
                      />
                    </div>
                  </div>
                )}

                {inspectorTab === "tokens" && (
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="text-[10px] text-neutral-500 leading-relaxed mb-4 p-2.5 bg-violet-50 border border-violet-100 rounded-md">
                      Override tokens for this component only. Click the reset icon to revert.
                    </div>
                    <TokenEditor
                      tokens={selectedNode.tokenOverrides || {}}
                      referenceTokens={isJsxSnippet(selectedNode.code) ? globalPodTokens : globalTokens}
                      isOverride
                      onChange={(cat, key, val) => updateNodeTokenOverride(selectedNode.id, cat, key, val)}
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 p-2 shrink-0">
                <div className="grid grid-cols-2 gap-1">
                  <button onClick={() => duplicateNode(selectedNode.id)} className="text-[11px] text-neutral-700 hover:bg-neutral-100 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors">
                    <Copy className="w-3 h-3" />
                    Duplicate
                  </button>
                  <button onClick={() => deleteNode(selectedNode.id)} className="text-[11px] text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors">
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-neutral-100 flex items-center justify-center">
                  <MousePointer2 className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-xs text-neutral-600 font-medium mb-1">Nothing selected</div>
                <div className="text-[11px] text-neutral-400 leading-relaxed">Click a component on the canvas to edit.</div>
              </div>
              {nodes.length > 0 && (
                <div className="text-left">
                  <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-2">Components</div>
                  <div className="space-y-0.5">
                    {nodes.map((n) => (
                      <button key={n.id} onClick={() => setSelectedNodeId(n.id)} className="w-full text-left text-[11px] text-neutral-700 hover:bg-neutral-100 px-2 py-1.5 rounded flex items-center gap-2 transition-colors">
                        <div className="w-1 h-1 rounded-full bg-neutral-400" />
                        <span className="font-medium truncate">{n.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showSyntaxHint && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowSyntaxHint(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Component syntax</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">Uses h() helper — alias for React.createElement</p>
              </div>
              <button onClick={() => setShowSyntaxHint(false)} className="p-1 hover:bg-neutral-100 rounded transition-colors">
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-[12px]">
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">Signature</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`h(tag, props, ...children)`}</pre>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">Simple element</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`h('div', null, 'Hello')
// same as: <div>Hello</div>`}</pre>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">With handlers & style</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`h('button', {
  onClick: () => alert('hi'),
  style: { padding: 10 }
}, 'Click me')`}</pre>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">Nested</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`h('div', null,
  h('h1', null, 'Title'),
  h('p', null, 'Description')
)`}</pre>
              </div>
              <div>
                <div className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mb-1.5">Design tokens</div>
                <pre className="bg-neutral-50 p-3 rounded-md font-mono text-[11px] leading-relaxed overflow-x-auto">{`style: {
  color: "var(--token-colors-brand)",
  padding: "var(--token-spacing-btn-y-md)",
  borderRadius: "var(--token-radius-btn)"
}`}</pre>
              </div>
              <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-200 leading-relaxed">
                Hooks available: <code className="font-mono bg-neutral-100 px-1 rounded">useState</code>, <code className="font-mono bg-neutral-100 px-1 rounded">useEffect</code>, <code className="font-mono bg-neutral-100 px-1 rounded">useRef</code>, <code className="font-mono bg-neutral-100 px-1 rounded">useCallback</code>, <code className="font-mono bg-neutral-100 px-1 rounded">useMemo</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}