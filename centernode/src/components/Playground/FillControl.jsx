"use client";
import { useRef, useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";

// =============================================================
// FillControl — color/image background picker for a group.
// Modes:
//   undefined / null → "no fill" (transparent, default)
//   "#RRGGBB"       → solid colour
//   "url(data:...)" → image (stored as data URL)
//
// UI:
//   • Swatch chip on the left (checkered pattern when no fill, colour or
//     image preview otherwise)
//   • Value text (hex or "Image") in the middle
//   • Image upload button on the right
//   • Clear (X) button when a value exists
export default function FillControl({ value, onChange }) {
  const fileInputRef = useRef(null);
  const colorInputRef = useRef(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isImage = typeof value === "string" && value.startsWith("url(");
  const isColor = typeof value === "string" && /^#[0-9a-fA-F]{3,8}$/.test(value);
  const hasValue = isImage || isColor;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(`url(${JSON.stringify(reader.result)})`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Swatch styling: show checkered pattern when no value, otherwise
  // colour/image preview.
  const swatchStyle = isImage
    ? {
        backgroundImage: value,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : isColor
      ? { background: value }
      : {
          backgroundImage:
            "linear-gradient(45deg, var(--cn-border-default) 25%, transparent 25%, transparent 75%, var(--cn-border-default) 75%)," +
            "linear-gradient(45deg, var(--cn-border-default) 25%, transparent 25%, transparent 75%, var(--cn-border-default) 75%)",
          backgroundPosition: "0 0, 6px 6px",
          backgroundSize: "12px 12px",
          background:
            "repeating-conic-gradient(var(--cn-border-default) 0% 25%, transparent 0% 50%) 50% / 8px 8px",
        };

  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 h-7 px-2 rounded-md border border-cn-border-subtle bg-transparent hover:border-cn-border-default transition-colors"
      >
        <button
          type="button"
          onClick={() => {
            if (isImage) return;
            // Open the native colour input — better than building our
            // own picker. The button itself is the visual.
            colorInputRef.current?.click();
          }}
          className="w-4 h-4 rounded-sm border border-cn-border-subtle shrink-0 cursor-pointer"
          style={swatchStyle}
          title={hasValue ? "Edit fill" : "Set fill colour"}
        />
        <input
          ref={colorInputRef}
          type="color"
          value={isColor ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <span className="flex-1 cn-mono text-[11px] text-cn-text-primary truncate">
          {isImage ? "Image" : isColor ? value.toUpperCase() : <span className="text-cn-text-muted">None</span>}
        </span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-cn-text-muted hover:text-cn-text-primary shrink-0 transition-colors"
          title="Upload image"
        >
          <ImageIcon className="w-3 h-3" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="sr-only"
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-cn-text-muted hover:text-cn-danger shrink-0 transition-colors"
            title="Clear fill"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
