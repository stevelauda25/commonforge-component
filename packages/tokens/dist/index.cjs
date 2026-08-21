"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  preset: () => preset,
  primitives: () => primitives,
  tailwindPreset: () => tailwind_preset_default
});
module.exports = __toCommonJS(index_exports);

// src/primitives.ts
var primitives = {
  neutral: {
    25: "251 250 249",
    50: "246 244 241",
    100: "239 235 230",
    200: "226 220 212",
    300: "207 199 188",
    400: "176 166 153",
    500: "139 129 117",
    600: "107 98 89",
    700: "78 70 64",
    800: "53 46 41",
    900: "38 32 28",
    950: "32 27 24"
  },
  crimson: {
    25: "255 245 244",
    50: "255 227 225",
    100: "254 208 205",
    200: "252 162 156",
    300: "249 118 108",
    400: "245 73 61",
    500: "192 24 12",
    600: "152 21 11",
    700: "114 16 9",
    800: "94 14 8",
    900: "74 12 7",
    950: "55 9 6"
  },
  green: {
    25: "236 253 243",
    50: "210 248 224",
    100: "168 239 198",
    200: "114 224 166",
    300: "65 203 133",
    400: "31 176 107",
    500: "18 148 87",
    600: "14 120 71",
    700: "12 94 57",
    800: "10 74 45",
    900: "8 58 36",
    950: "5 39 24"
  },
  amber: {
    25: "255 248 230",
    50: "253 236 190",
    100: "250 216 132",
    200: "245 194 74",
    300: "239 173 32",
    400: "229 156 14",
    500: "209 139 12",
    600: "174 114 10",
    700: "139 91 8",
    800: "111 73 6",
    900: "89 59 5",
    950: "62 41 4"
  },
  red: {
    25: "255 240 241",
    50: "255 218 221",
    100: "255 184 190",
    200: "251 138 147",
    300: "246 91 104",
    400: "241 53 70",
    500: "229 29 49",
    600: "194 21 42",
    700: "156 17 34",
    800: "124 13 27",
    900: "99 11 22",
    950: "68 6 14"
  },
  gray: {
    25: "250 250 250",
    50: "245 245 245",
    75: "240 240 240",
    100: "235 235 235",
    150: "224 224 224",
    200: "214 214 214",
    250: "204 204 204",
    300: "194 194 194",
    350: "184 184 184",
    400: "163 163 163",
    500: "143 143 143",
    600: "122 122 122",
    700: "102 102 102",
    800: "82 82 82",
    900: "61 61 61",
    950: "20 20 20",
    975: "10 10 10"
  }
};

// src/tailwind-preset.ts
var rgbVar = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;
var tripletToHex = (triplet) => `#${triplet.split(" ").map((channel) => Number(channel).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
var ramp = (scale) => Object.fromEntries(
  Object.entries(scale).map(([shade, triplet]) => [shade, tripletToHex(triplet)])
);
var colors = {
  neutral: ramp(primitives.neutral),
  crimson: ramp(primitives.crimson),
  green: ramp(primitives.green),
  amber: ramp(primitives.amber),
  red: ramp(primitives.red),
  gray: ramp(primitives.gray)
};
var backgroundColor = {
  canvas: rgbVar("bg-canvas"),
  surface: rgbVar("bg-surface"),
  muted: rgbVar("bg-muted"),
  subtle: rgbVar("bg-subtle"),
  disabled: rgbVar("bg-disabled"),
  inverse: rgbVar("bg-inverse"),
  neutral: {
    DEFAULT: rgbVar("bg-neutral"),
    ...ramp(primitives.neutral)
  },
  brand: rgbVar("bg-brand"),
  "brand-hover": rgbVar("bg-brand-hover"),
  "brand-subtle": rgbVar("bg-brand-subtle"),
  destructive: rgbVar("bg-destructive"),
  "destructive-hover": rgbVar("bg-destructive-hover"),
  "destructive-subtle": rgbVar("bg-destructive-subtle"),
  error: rgbVar("bg-error"),
  "error-subtle": rgbVar("bg-error-subtle"),
  success: rgbVar("bg-success"),
  "success-subtle": rgbVar("bg-success-subtle"),
  warning: rgbVar("bg-warning"),
  "warning-subtle": rgbVar("bg-warning-subtle")
};
var borderColor = {
  DEFAULT: rgbVar("border-default"),
  default: rgbVar("border-default"),
  subtle: rgbVar("border-subtle"),
  strong: rgbVar("border-strong"),
  brand: rgbVar("border-brand"),
  destructive: rgbVar("border-destructive"),
  error: rgbVar("border-error"),
  success: rgbVar("border-success"),
  warning: rgbVar("border-warning")
};
var textColor = {
  default: rgbVar("text-default"),
  strong: rgbVar("text-strong"),
  subtle: rgbVar("text-subtle"),
  muted: rgbVar("text-muted"),
  disabled: rgbVar("text-disabled"),
  placeholder: rgbVar("text-placeholder"),
  inverse: rgbVar("text-inverse"),
  brand: rgbVar("text-brand"),
  success: rgbVar("text-success"),
  destructive: rgbVar("text-destructive"),
  error: rgbVar("text-error"),
  warning: rgbVar("text-warning"),
  "on-brand": rgbVar("text-on-brand"),
  "on-destructive": rgbVar("text-on-destructive"),
  "on-success": rgbVar("text-on-success"),
  "on-warning": rgbVar("text-on-warning")
};
var preset = {
  theme: {
    extend: {
      colors,
      backgroundColor,
      borderColor,
      textColor,
      borderRadius: {
        none: "var(--radius-none)",
        xxs: "var(--radius-2xs)",
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        "10": "var(--radius-10)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)"
      },
      boxShadow: {
        "elev-1": "var(--shadow-elev-1)",
        "elev-2": "var(--shadow-elev-2)",
        "pop": "var(--shadow-pop)",
        "button": "var(--shadow-button)",
        "frame": "var(--shadow-frame)",
        "card": "var(--shadow-card)"
      },
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "-apple-system", "sans-serif"]
      },
      fontSize: {
        "3xs": ["0.5625rem", { lineHeight: "0.8125rem" }],
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        "caption": ["0.6875rem", { lineHeight: "0.9375rem" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.125rem" }],
        "body": ["0.875rem", { lineHeight: "1.25rem" }],
        "body-lg": ["1rem", { lineHeight: "1.5rem" }]
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)"
      }
    }
  }
};
var tailwind_preset_default = preset;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  preset,
  primitives,
  tailwindPreset
});
