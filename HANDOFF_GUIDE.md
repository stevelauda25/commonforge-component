# CommonForge Agentic Design System — Handover & Engineering Guide

> **Version:** `v0.1.4`  
> **Source of Truth:** Figma File `TCd9exLXTUMciyw1VqnPSK` (CF Design System 1.1)  
> **Packages:** `@commonforge/tokens` · `@commonforge/ui` · `apps/docs`  
> **Repository:** [`stevelauda25/commonforge-component`](https://github.com/stevelauda25/commonforge-component)

---

## 1. Executive Summary

CommonForge Design System is a **token-driven, dark-mode-ready React design system** engineered specifically for high-velocity autonomous agentic pairing and human developer workflows.

The codebase is designed as a direct projection of Figma tokens and components, maintained with automated drift detection, strict token hierarchies, and zero hardcoded design values.

```
Figma (Source of Truth)
   │
   ├── [Figma Variables & Components]
   │
   ▼
packages/tokens       ───► CSS Custom Properties + Tailwind Preset
   │
   ▼
packages/ui           ───► 38 Accessible React Atoms & Molecules
   │
   ▼
apps/docs             ───► Vite + MDX Interactive Showcase & Review Platform
```

---

## 2. Architecture & Directory Structure

This repository is structured as a lightweight **pnpm monorepo**:

```
commonforge-design-system/
├── packages/
│   ├── tokens/                  # Semantic tokens, primitives & Tailwind preset
│   │   ├── src/
│   │   │   ├── primitives.ts    # Raw RGB channel triplets (neutral, crimson, green, etc.)
│   │   │   ├── theme.css        # Semantic CSS variables (:root and .dark scopes)
│   │   │   └── tailwind-preset.ts # Bridge mapping CSS variables to Tailwind utility classes
│   │   ├── dist/                # Bundled CJS/ESM artifacts + theme.css
│   │   └── package.json         # Published as @commonforge/tokens
│   │
│   └── ui/                      # 38 Production React Components
│       ├── src/
│       │   ├── button/          # Primary, outline, danger, inverse button atom
│       │   ├── text-input/      # Single-line raw text input (bg-white)
│       │   ├── text-area/       # Multiline text input with character counter
│       │   ├── text-field/      # Form input wrapper with label, tooltip & hint
│       │   ├── dropdown/        # Filterable & select dropdown
│       │   ├── combobox/        # Select form field with search
│       │   ├── tag/             # Compact chip with selected/removable states
│       │   ├── badge/           # Status and metadata label
│       │   ├── lib/             # cn() utility helper (clsx + tailwind-merge)
│       │   └── index.ts         # Central component export barrel
│       ├── dist/                # Pre-compiled CJS/ESM/DTS bundle
│       └── package.json         # Published as @commonforge/ui
│
├── apps/
│   └── docs/                    # Interactive Documentation & Showcase
│       ├── src/
│       │   ├── components/      # UI Shell, Sidebar, Gallery Cards & Theme Toggle
│       │   ├── pages/           # MDX component and foundation specs
│       │   ├── lib/routes.ts    # Route registry & component descriptions
│       │   └── index.css        # Docs stylesheet importing tokens
│       ├── vite.config.ts       # Vite configuration with MDX & path aliases
│       └── tailwind.config.ts   # Docs Tailwind configuration extending @commonforge/tokens
│
├── foundation/                  # Baseline token dumps and foundation specifications
├── scripts/                     # Automation scripts (Figma drift check & canvas sync)
└── package.json                 # Monorepo root configuration (pnpm workspace)
```

---

## 3. The Agentic Design System Workflow

The design system uses an **autonomous, deterministic execution model** for AI agents (and engineers) to sync with Figma with zero deliberation.

### The Sat-Set Decision Tree
```
Figma Update Identified
      │
      ├── 1. Exact Scope Check (Which variant and which property changed?)
      │
      ├── 2. Color Classification:
      │       ├── Is it an existing semantic brand token?
      │       │     └── Update value in packages/tokens/src/theme.css (:root + .dark)
      │       │
      │       └── Is it a new exploratory color outside brand palette?
      │             └── Add --color-experiment-<name> in theme.css
      │             └── Expose experiment-<name> in tailwind-preset.ts
      │             └── Apply targeted override only to affected variant in component .tsx
      │
      ├── 3. Rebuild Packages (`pnpm build:packages`)
      └── 4. Verify in Docs (`apps/docs`)
```

### Sacred Tokens — Do Not Modify
These core tokens define the CommonForge brand identity and must never be arbitrarily replaced during variant syncs:
* `accent-default`, `accent-hover`, `accent-active`, `accent-fg`, `accent-subtle`
* `danger-default`, `danger-hover`, `danger-active`, `danger-fg`, `danger-subtle`
* `warning-default`, `warning-fg`, `warning-subtle`
* `success-default`, `success-fg`, `success-subtle`
* `info-default`, `info-fg`, `info-subtle`
* `border-focus`
* `shadow-glow-accent-*`, `shadow-glow-danger-*`, `shadow-glow-accent-text`

---

## 4. Token & Styling Architecture

### 1. Primitives Layer (`packages/tokens/src/primitives.ts`)
Stores raw channel triplets (e.g., `'192 24 12'` for brand crimson) so Tailwind can compose alpha channel modifiers dynamically.

### 2. Semantic CSS Variables Layer (`packages/tokens/src/theme.css`)
Exposes semantic design intent to DOM elements:
* `:root` defines light theme values (`--color-bg-canvas: 251 250 249`, `--color-bg-surface: 255 255 255`, etc.).
* `.dark` defines inverted dark theme values.
* Radius scale: `--radius-xs` (4px), `--radius-sm` (6px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-full` (9999px).
* Elevation & Button Shadows: Multi-layer inset and drop shadow recipes.

### 3. Tailwind Preset Bridge (`packages/tokens/src/tailwind-preset.ts`)
Maps semantic CSS variables to standard Tailwind utility classes (`bg-canvas`, `bg-surface`, `bg-brand`, `text-default`, `text-subtle`, `border-default`).

---

## 5. Component Development Rules

When creating or maintaining components in `packages/ui/src/`:

1. **Zero Hardcoded Hex:** Never embed arbitrary hex codes in components without token backing. Always use semantic Tailwind classes (`bg-surface`, `text-default`, `border-default`).
2. **Ref Forwarding & Typing:** Every interactive element must use `forwardRef` or export strongly typed interfaces extending standard HTML attributes.
3. **Class Composition:** Merge classes using the `cn()` helper (`clsx` + `tailwind-merge`) to permit consumer overrides:
   ```tsx
   className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
   ```
4. **Input Field Standards:** All form field components (`TextInput`, `Textarea`, `Dropdown`, `SearchField`, `TextField`, `Combobox`) enforce clean `bg-white` fills in light mode with subtle border transitions.
5. **Interactive Motion & Dismissal:** Interactive removals (badges, tags, list rows) must follow staggered CSS transitions (opacity, scale, and width collapse) to avoid abrupt DOM snap jumps.

---

## 6. How to Consume the Design System

### Installation in External Consumer Apps
```bash
npm install @commonforge/ui @commonforge/tokens
# or
pnpm add @commonforge/ui @commonforge/tokens
```

### Global Styles Setup
In the application's root entry file (`main.tsx`, `index.tsx`, or Next.js `layout.tsx`):
```tsx
import '@commonforge/tokens/theme.css';
```

### Tailwind Setup in Consumer Application
In the consumer app's `tailwind.config.js`:
```js
import preset from '@commonforge/tokens/tailwind-preset';

export default {
  presets: [preset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@commonforge/ui/dist/**/*.{js,mjs,cjs}',
  ],
};
```

### Component Usage Example
```tsx
import { Button, Tag, TextInput, TextField, Dropdown } from '@commonforge/ui';

export function ExamplePage() {
  return (
    <div className="p-6 space-y-4">
      <TextField
        label="Project Name"
        required
        placeholder="Enter project name..."
      />
      <div className="flex gap-2">
        <Button variant="primary" size="md">Save Changes</Button>
        <Tag variant="selected">Active</Tag>
      </div>
    </div>
  );
}
```

---

## 7. Developer & Release Workflow Cheat Sheet

### Common Development Commands

| Command | Description |
|---|---|
| `pnpm install` | Install all dependencies across the workspace |
| `pnpm dev` | Start the interactive documentation server at `http://localhost:7100` |
| `pnpm build:packages` | Compile `@commonforge/tokens` and `@commonforge/ui` via `tsup` |
| `pnpm build:docs` | Build the static documentation website for production |
| `pnpm typecheck` | Run TypeScript strict type checks across all packages |

### NPM Release Process

To release a new version of the design system:

1. **Verify Codebase Health:**
   ```bash
   pnpm typecheck
   pnpm build:packages
   ```
2. **Bump Version:**
   Update the `"version"` field in both:
   * `packages/tokens/package.json`
   * `packages/ui/package.json`
   * `apps/docs/src/components/shell/Topbar.tsx`
3. **Publish to NPM Registry:**
   ```bash
   cd packages/tokens && npm publish --access public
   cd ../ui && npm publish --access public
   cd ../..
   ```
4. **Commit and Tag Git:**
   ```bash
   git add .
   git commit -m "release: bump @commonforge/{tokens,ui} to vX.Y.Z"
   git push origin main
   ```

---

## 8. Handover Checklist

- [x] All 38 components and 5 foundations documented and verified in `apps/docs`.
- [x] Input and form components standardized with clean white fills (`bg-white`).
- [x] Tag component `selected` variant styling fixed and verified.
- [x] Showcase gallery cards redesigned to modern icon + description layout.
- [x] Standalone testbeds (`centernode`, `client-test`) removed for clean delivery.
- [x] `@commonforge/tokens@0.1.4` and `@commonforge/ui@0.1.4` published to NPM.
- [x] Clean typecheck (`tsc --noEmit`) and Vite build verified across workspace.
- [x] Git repository synced with remote `origin/main`.
