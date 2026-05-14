import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from "lucide-react";

const SizingIcon = ({ mode, isWidth }) => {
  if (mode === "fixed") {
    if (isWidth) {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3V9" />
          <path d="M10 3V9" />
          <path d="M2 6H10" />
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2H9" />
        <path d="M3 10H9" />
        <path d="M6 2V10" />
      </svg>
    );
  }

  if (mode === "auto") {
    if (isWidth) {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3.5L5.5 6L3 8.5" />
          <path d="M9 3.5L6.5 6L9 8.5" />
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 3L6 5.5L8.5 3" />
        <path d="M3.5 9L6 6.5L8.5 9" />
      </svg>
    );
  }

  if (mode === "fill") {
    if (isWidth) {
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.5 3.5L1 6L3.5 8.5" />
          <path d="M8.5 3.5L11 6L8.5 8.5" />
          <path d="M1 6H11" />
        </svg>
      );
    }
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 3.5L6 1L8.5 3.5" />
        <path d="M3.5 8.5L6 11L8.5 8.5" />
        <path d="M6 1V11" />
      </svg>
    );
  }

  return null;
};

export default function SizeInput({ type, value, mode, onChange }) {
  const isWidth = type === "width";
  const numericValue = typeof value === "number" ? value : (isWidth ? 400 : 200);
  
  const [localStr, setLocalStr] = useState(String(Math.round(numericValue)));
  const [lastNumeric, setLastNumeric] = useState(numericValue);
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Sync external updates (e.g., resize drag) into local state unless focused
  if (numericValue !== lastNumeric) {
    setLastNumeric(numericValue);
    if (!focused) {
      setLocalStr(String(Math.round(numericValue)));
    }
  }

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  const commit = () => {
    if (localStr.trim() === "") {
      setLocalStr(String(Math.round(numericValue)));
      return;
    }
    const n = parseFloat(localStr);
    if (isNaN(n)) {
      setLocalStr(String(Math.round(numericValue)));
      return;
    }
    const clamped = Math.max(40, n);
    setLocalStr(String(Math.round(clamped)));
    // Typing a number implies switching to fixed mode
    onChange({ mode: "fixed", value: clamped });
  };

  const MODES = [
    { id: "fixed", label: `Fixed ${isWidth ? 'width' : 'height'}` },
    { id: "auto", label: "Hug contents" }
  ];

  const currentMode = MODES.find(m => m.id === mode) || MODES[0];
  const isFixed = mode === 'fixed';

  return (
    <div className="relative flex-1" ref={menuRef}>
      <div 
        className={`flex items-center h-8 bg-neutral-50 border border-neutral-200 rounded-md transition-colors ${focused ? "border-neutral-400 bg-white" : "hover:border-neutral-300"}`}
      >
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center w-7 h-full text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer shrink-0 border-r border-transparent hover:border-neutral-200"
          title="Change sizing mode"
        >
          <SizingIcon mode={mode} isWidth={isWidth} />
        </button>

        <input
          type="text"
          value={isFixed ? localStr : currentMode.label}
          disabled={!isFixed}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); commit(); }}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9]/g, "");
            setLocalStr(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.target.blur();
            if (e.key === "Escape") {
              setLocalStr(String(Math.round(numericValue)));
              e.target.blur();
            }
          }}
          className={`flex-1 min-w-0 w-full h-full bg-transparent px-2 text-[11px] outline-none ${!isFixed ? 'text-neutral-400 cursor-default' : 'text-neutral-700 font-mono'}`}
        />

        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center w-6 h-full text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 mt-1 w-[160px] bg-white border border-neutral-200 shadow-lg rounded-lg py-1 z-50">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => {
                onChange({ mode: m.id, value: numericValue });
                setMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 hover:bg-blue-50 text-left group transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-4 text-neutral-400 flex justify-center"><SizingIcon mode={m.id} isWidth={isWidth} /></span>
                <span className="text-[11px] text-neutral-700 group-hover:text-blue-700">{m.label}</span>
              </div>
              {mode === m.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
