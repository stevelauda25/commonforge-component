# CommonForge Agentic Design System — Handover & Engineering Guide

> **Version:** `v0.1.4`  
> **Source of Truth:** Figma File `TCd9exLXTUMciyw1VqnPSK` (CF Design System 1.1)  
> **Published Packages:** `@commonforge/tokens` · `@commonforge/ui`  
> **Docs & Review App:** [`https://commonforge-component-docs.vercel.app/`](https://commonforge-component-docs.vercel.app/) (Local: `http://localhost:7100`)  
> **Repository:** [`stevelauda25/commonforge-component`](https://github.com/stevelauda25/commonforge-component)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Repository Architecture & Monorepo Structure](#2-repository-architecture--monorepo-structure)
3. [The Agentic Design System Workflow](#3-the-agentic-design-system-workflow)
4. [Token & Styling Architecture](#4-token--styling-architecture)
5. [Component Development Protocol](#5-component-development-protocol)
6. [Consumer Setup Guide (Using the Packages)](#6-consumer-setup-guide-using-the-packages)
7. [AI Agent Slash Commands & Shortcuts](#7-ai-agent-slash-commands--shortcuts)
8. [NPM Publishing & Account Transfer Playbook](#8-npm-publishing--account-transfer-playbook)
9. [Developer CLI Cheat Sheet](#9-developer-cli-cheat-sheet)
10. [Handover Status & Verification Checklist](#10-handover-status--verification-checklist)

---

## 1. Executive Summary

CommonForge Design System is an enterprise-grade, **token-driven, dark-mode-aware React component library** engineered specifically for pair programming with autonomous AI coding agents as well as human engineering teams.

The codebase serves as a continuous, deterministic projection of design tokens in Figma. It eliminates design drift through strict token layering, automated utilities, and zero hardcoded style values.

```
┌─────────────────────────────────────────────────────────────┐
│                    FIGMA (Source of Truth)                  │
│              Variables · Component Sets · Tokens            │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Sync & Drift Detection)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       packages/tokens                       │
│    Primitives (RGB) ──► Semantic theme.css ──► Tailwind     │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Semantic Utility Classes)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         packages/ui                         │
│           38 Fully Accessible Production React Atoms        │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Local Workspace Link)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                          apps/docs                          │
│            Interactive MDX Showcase & Review Surface        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Repository Architecture & Monorepo Structure

The repository is managed as a **pnpm monorepo** (pnpm v9.7.0):

```
commonforge-design-system/
├── packages/
│   ├── tokens/                  # Design tokens, CSS variables & Tailwind preset
│   │   ├── src/
│   │   │   ├── primitives.ts    # Raw RGB channel triplets (neutral, crimson, green, etc.)
│   │   │   ├── theme.css        # Semantic CSS custom properties (:root & .dark)
│   │   │   └── tailwind-preset.ts # Bridge mapping CSS variables to Tailwind utility classes
│   │   ├── dist/                # Pre-compiled CJS/ESM artifacts + theme.css
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
│   └── docs/                    # Interactive Documentation & Showcase App
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
└── package.json                 # Monorepo root configuration
```

---

## 3. The Agentic Design System Workflow

When working with AI agents (Antigravity, Claude, Codex), the design system enforces a **deterministic execution model** with zero deliberation over Figma updates.

### The Autonomous Decision Tree
```
Figma Change Detected
      │
      ├── 1. Identify Exact Scope (Which variant & which property changed?)
      │
      ├── 2. Color Categorization:
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

### Sacred Tokens — Never Modify
These core tokens define brand identity and must never be altered during standard syncs:
* `accent-default`, `accent-hover`, `accent-active`, `accent-fg`, `accent-subtle`
* `danger-default`, `danger-hover`, `danger-active`, `danger-fg`, `danger-subtle`
* `warning-default`, `warning-fg`, `warning-subtle`
* `success-default`, `success-fg`, `success-subtle`
* `info-default`, `info-fg`, `info-subtle`
* `border-focus`
* `shadow-glow-accent-*`, `shadow-glow-danger-*`, `shadow-glow-accent-text`

---

## 4. Token & Styling Architecture

### Layer 1: Primitives (`packages/tokens/src/primitives.ts`)
Stores raw channel triplets (e.g. `'192 24 12'` for brand crimson) so Tailwind can compose alpha channel modifiers dynamically (`bg-brand/80`).

### Layer 2: Semantic CSS Custom Properties (`packages/tokens/src/theme.css`)
Defines the component vocabulary:
* `:root` defines light theme values (`--color-bg-canvas: 251 250 249`, `--color-bg-surface: 255 255 255`, etc.).
* `.dark` defines inverted dark theme values.
* Radius scale: `--radius-xs` (4px), `--radius-sm` (6px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-full` (9999px).
* Elevation & Button Shadows: Multi-layer inset and drop shadow recipes.

### Layer 3: Tailwind Preset Bridge (`packages/tokens/src/tailwind-preset.ts`)
Bridges semantic CSS variables and primitive ramps into Tailwind utility classes:
* `bg-canvas`, `bg-surface`, `bg-brand`, `bg-neutral`, `bg-neutral-900`
* `text-default`, `text-subtle`, `text-muted`, `text-brand`
* `border-default`, `border-subtle`, `border-strong`

---

## 5. Component Development Protocol

When creating or maintaining components in `packages/ui/src/`:

1. **Zero Hardcoded Hex:** Never embed arbitrary hex codes without token backing. Always use semantic Tailwind classes (`bg-surface`, `text-default`, `border-default`).
2. **Ref Forwarding & Typing:** Every interactive element must use `forwardRef` or export strongly typed interfaces extending standard HTML attributes.
3. **Class Composition:** Merge classes using the `cn()` helper (`clsx` + `tailwind-merge`) to permit consumer overrides:
   ```tsx
   className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
   ```
4. **Input Field Standards:** All form field components (`TextInput`, `Textarea`, `Dropdown`, `SearchField`, `TextField`, `Combobox`) enforce clean `bg-white` fills in light mode with subtle border transitions.
5. **Interactive Motion & Dismissal:** Interactive removals (badges, tags, list rows) must follow staggered transitions (opacity, scale, and width collapse) to avoid abrupt DOM snap jumps.

---

## 6. Consumer Setup Guide (Using the Packages)

### 1. Installation in External Applications
```bash
npm install @commonforge/ui @commonforge/tokens
# or
pnpm add @commonforge/ui @commonforge/tokens
# or
yarn add @commonforge/ui @commonforge/tokens
```

### 2. Global Styles Setup
Import the design system tokens in your app's root entry file (`main.tsx`, `index.tsx`, or Next.js `app/layout.tsx`):
```tsx
import '@commonforge/tokens/theme.css';
```

### 3. Tailwind Configuration
In your consumer application's `tailwind.config.js` (or `.ts`):
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

### 4. Component Usage Example
```tsx
import React, { useState } from 'react';
import { Button, Tag, TextField, Dropdown, Checkbox } from '@commonforge/ui';

export function ProjectSettings() {
  const [selectedTag, setSelectedTag] = useState(false);
  const [remember, setRemember] = useState(true);

  return (
    <div className="p-6 max-w-lg space-y-4">
      <TextField
        label="Workspace Name"
        required
        placeholder="e.g. Production Team"
        hint="This name will appear on all shared reports."
      />

      <Dropdown
        placeholder="Select Environment"
        options={[
          { value: 'prod', label: 'Production' },
          { value: 'staging', label: 'Staging' },
          { value: 'dev', label: 'Development' },
        ]}
      />

      <div className="flex items-center gap-2">
        <Checkbox checked={remember} onCheckedChange={setRemember} />
        <span className="text-sm">Remember environment preference</span>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="primary" size="md">Save Workspace</Button>
        <Tag
          variant={selectedTag ? 'selected' : 'default'}
          onClick={() => setSelectedTag(!selectedTag)}
        >
          {selectedTag ? 'Active Filter' : 'Click to Filter'}
        </Tag>
      </div>
    </div>
  );
}
```

---

## 7. AI Agent Slash Commands & Shortcuts

The repository includes pre-configured slash commands and automated skills for AI agent workflows:

| Slash Command | Purpose | When to Use |
|---|---|---|
| `/run` | Idempotent dev server launcher. Checks port availability and spins up the Docs app. | At the beginning of a coding session. |
| `/run docs` | Starts only the documentation server (`http://localhost:7100`). | For previewing and reviewing components. |
| `/restart-server` | Kills running Vite processes, clears `.vite` cache, and restarts server in the background. | When UI doesn't reflect changes after recompilation. |
| `/verify-component <slug>` | Pulls fresh Figma metadata, builds a variant matrix, and audits against component `.tsx`. | To verify multi-variant fidelity (e.g. Button, Tag). |
| `/sync-figma <slug>` | Autonomous Figma sync: pulls tokens, applies targeted variant overrides, and auto-blesses state. | Routine token or shape synchronization. |
| `/new-item <figma-url>` | Bootstraps a brand new Figma component into manifest tracking. | Adding a new component to the library. |

---

## 8. NPM Publishing & Account Transfer Playbook

### Scenario A: Standard Release Under Current Account (`@commonforge`)

1. **Verify workspace typecheck and build:**
   ```bash
   pnpm typecheck
   pnpm build:packages
   ```

2. **Bump version in `package.json` files:**
   * In `packages/tokens/package.json`: `"version": "0.1.5"`
   * In `packages/ui/package.json`: `"version": "0.1.5"`
   * In `apps/docs/src/components/shell/Topbar.tsx`: `v0.1.5`

3. **Publish to NPM:**
   ```bash
   cd packages/tokens && npm publish --access public
   cd ../ui && npm publish --access public
   cd ../..
   ```

4. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "release: bump @commonforge/{tokens,ui} to v0.1.5"
   git push origin main
   ```

---

### Scenario B: Transferring to Client's Own NPM Account / Custom Scope

If the client wishes to publish these packages under their own NPM account or organizational scope (e.g., `@myclient/ui` and `@myclient/tokens`):

#### Step 1: Login with New NPM Account
```bash
npm login
# Check active logged in user
npm whoami
```

#### Step 2: Update Package Names in `package.json`
1. In `packages/tokens/package.json`:
   ```json
   {
     "name": "@myclient/tokens",
     "version": "0.1.0"
   }
   ```
2. In `packages/ui/package.json`:
   ```json
   {
     "name": "@myclient/ui",
     "version": "0.1.0"
   }
   ```

#### Step 3: Update Internal Workspace References
1. In `apps/docs/package.json`:
   ```json
   "dependencies": {
     "@myclient/tokens": "workspace:*",
     "@myclient/ui": "workspace:*"
   }
   ```
2. In `apps/docs/tailwind.config.ts`:
   ```ts
   import preset from '@myclient/tokens/tailwind-preset';
   ```
3. In `apps/docs/src/index.css`:
   ```css
   @import "@myclient/tokens/theme.css";
   ```

#### Step 4: Rebuild & Publish Under New Scope
```bash
# Rebuild bundle
pnpm build:packages

# Publish tokens
cd packages/tokens
npm publish --access public   # or omit --access public if publishing to private paid org

# Publish UI components
cd ../ui
npm publish --access public

cd ../..
```

---

## 9. Developer CLI Cheat Sheet

### Common Development Tasks

```bash
# Install all workspace dependencies
pnpm install

# Start local interactive docs app
pnpm dev
# App will run at http://localhost:7100

# Compile UI and Token packages
pnpm build:packages

# Build static production bundle for documentation
pnpm build:docs

# Run full TypeScript validation across all workspaces
pnpm typecheck

# Clean build artifacts and node_modules
pnpm clean
```

---

## 10. Handover Status & Verification Checklist

- [x] **Component Coverage:** All 38 components and 5 foundations documented and verified in `apps/docs`.
- [x] **Form Field Standardization:** All input controls (`TextInput`, `Textarea`, `Dropdown`, `SearchField`, `TextField`, `Combobox`) updated to standardized white fill (`bg-white`).
- [x] **Tag State Fidelity:** `Tag` component variant `selected` fixed with dark background (`#26201C`) and white text.
- [x] **Showcase Gallery Layout:** Home page showcase redesigned to clean, minimal icon-based card layout with 2-line descriptions.
- [x] **Handover Hygiene:** Sub-apps (`centernode`, `client-test`) and dead mockup code cleanly removed.
- [x] **Release Status:** Published to NPM as `@commonforge/tokens@0.1.4` and `@commonforge/ui@0.1.4`.
- [x] **Type Safety & Build:** Zero TypeScript errors (`tsc --noEmit`) and Vite production bundle compiles cleanly.
- [x] **Git Remote Sync:** Up-to-date with remote branch `origin/main`.
