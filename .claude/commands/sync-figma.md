---
description: Pull a component from Figma and sync tokens, the React component, and the docs page.
---

# /sync-figma

Sync a single Figma node into POD Design System: tokens → component → docs page.

**Argument:** `$ARGUMENTS` — a Figma URL (`figma.com/design/<fileKey>/...?node-id=<nodeId>`) or a raw `<fileKey>:<nodeId>` pair. If empty, ask the user for one before continuing.

This is a **local-only** workflow. No PRs, no pushes — the loop ends when the diff looks right and `pnpm dev` renders cleanly.

---

## 0. Parse the input

From `$ARGUMENTS`, extract `fileKey` and `nodeId`:

- `figma.com/design/:fileKey/:name?node-id=:nodeId` → convert `-` to `:` in the nodeId (Figma's URL encoding).
- `figma.com/design/:fileKey/branch/:branchKey/...` → use `branchKey` as `fileKey`.
- Bare `<fileKey>:<nodeId>` → use as-is.

If parsing fails, stop and ask the user to paste a valid Figma URL.

## 1. Pull design context

Call the Figma MCP tools in this order:

1. `mcp__claude_ai_Figma__get_metadata` with `fileKey` + `nodeId` — get the node's name and type. This tells you whether it's a component, variant set, or arbitrary frame.
2. `mcp__claude_ai_Figma__get_screenshot` — keep the image; you'll reference it for visual review and for the docs `PreviewCard` snapshot.
3. `mcp__claude_ai_Figma__get_variable_defs` — list every Figma variable the node uses (colors, radii, spacing). This is the source of truth for token mapping.
4. `mcp__claude_ai_Figma__get_design_context` — returns React+Tailwind reference code, design hints, and any Code Connect mappings.

Treat the returned code as a **reference**, not the final implementation. POD has its own conventions (see step 4).

## 2. Identify the component

Map the Figma node to one of:

- **Existing ready component** (e.g. `button`, `checkbox`, `search-input`, `tooltip`) → this is a *refresh*. You'll update tokens and/or component code in place.
- **Existing planned component** (anything in [routes.ts](apps/docs/src/lib/routes.ts) with `status: 'planned'` — `badge`, `select`, `dropdown`, `dialog`, `switch`, `input`, `radio`, `label`) → this is the *first build*. Promote `status: 'planned'` → `status: 'ready'` when done.
- **Brand-new component** not in `routes.ts` → add a route, a sidebar entry, and a placeholder MDX page first (see step 6).

Pick a kebab-case slug for the component (e.g. `search-input`, `date-picker`). Use it consistently for: directory name in `packages/ui/src/<slug>/`, MDX filename in `apps/docs/src/pages/components/<PascalName>.mdx`, and route path `/components/<slug>`.

Tell the user which case applies before writing code.

## 3. Diff the tokens

Compare the Figma variables (from step 1.3) against the existing semantic tokens in [packages/tokens/src/theme.css](packages/tokens/src/theme.css).

For each Figma variable:

- **Already mapped** → reuse the existing semantic token (e.g. Figma `color/accent/default` ↔ `--color-accent-default`).
- **New value, existing token** → the brand has shifted. Update the variable's RGB triple in *both* `:root` and `.dark` blocks. Do not introduce a parallel token.
- **New token entirely** → add it to `theme.css` (both light + dark scopes), then expose it through [packages/tokens/src/tailwind-preset.ts](packages/tokens/src/tailwind-preset.ts) so it becomes a Tailwind class.

**Never hardcode a hex in `packages/ui/src/`.** That rule is verifiable by grep and we want to keep it that way.

If you only changed `theme.css`, the existing components automatically pick up the new values — no component edits needed.

## 4. Update or create the component

Reference: [packages/ui/src/button/button.tsx](packages/ui/src/button/button.tsx). Match its conventions exactly:

- `import * as React from 'react'`
- `forwardRef` with named function (so React DevTools shows `Button`, not `Anonymous`)
- TypeScript types exported alongside the component (`ButtonProps`, `ButtonVariant`, `ButtonSize`)
- Variant/size lookup tables as `Record<Variant, string>` — **plain objects, not `cva`** (the README says `cva`, but the actual codebase uses Records; follow the codebase)
- Compose classes with `cn(base, focusRing, variantClasses[variant], sizeClasses[size], className)` from `../lib/cn.js` and `../lib/focus-ring.js`
- Use semantic Tailwind classes only: `bg-canvas`, `text-primary`, `border-border-default`, `bg-accent-hover`, etc. No `bg-[#...]`, no `text-zinc-500`.
- ESM imports inside the workspace use `.js` extensions even for `.tsx` files (TypeScript ESM requirement)
- Default `type="button"` on `<button>` elements (avoid accidental form submits)
- For Radix-style primitives (Tooltip, Dialog, Select, Dropdown) prefer `@radix-ui/react-*` underneath rather than rolling your own.

File layout for a new component named `<slug>` (e.g. `badge`):

```
packages/ui/src/<slug>/
├── <slug>.tsx        # the component, types, lookup tables
└── index.ts          # barrel: re-export the component + types
```

Then add the barrel re-export to [packages/ui/src/index.ts](packages/ui/src/index.ts):

```ts
export * from './<slug>/index.js';
```

## 5. Update or create the docs page

The docs page lives at `apps/docs/src/pages/components/<PascalName>.mdx`. Reference: [apps/docs/src/pages/components/Button.mdx](apps/docs/src/pages/components/Button.mdx). Match its structure:

```mdx
import { Plus } from 'lucide-react';
import { Button } from '@pod/ui';

<PageHeader
  title="Button"
  description="One-line summary of what the component is for."
  status="ready"
/>

<PreviewCard>
  {/* Canonical example — what the consumer sees first */}
</PreviewCard>

```tsx
{/* Code that produces the canonical example */}
```

## Variants
…
## Sizes
…
## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
…

## Accessibility
…

## Things to watch
…
```

The MDX globals (`PageHeader`, `PreviewCard`, `EmptyComponentState`, `Swatch`, `PropsTable`, `StatusBadge`, `CodeBlock`) are pre-registered via [apps/docs/src/components/mdx-components.tsx](apps/docs/src/components/mdx-components.tsx) — just use them, no import needed.

For a brand-new component you're seeing for the first time, it's fine to ship a minimal docs page (canonical example + Props table) and add Variants/Sizes/Accessibility sections in a follow-up sync.

## 6. Wire up the route (only for brand-new components)

If the component wasn't already in [apps/docs/src/lib/routes.ts](apps/docs/src/lib/routes.ts):

1. Add an entry in the `components — ready` block (or `planned` if you only added a stub MDX):
   ```ts
   { path: '/components/<slug>', label: '<Pascal Name>', category: 'component', status: 'ready', description: '<one line>', load: () => import('../pages/components/<PascalName>.mdx') },
   ```
2. The sidebar reads from `componentRoutes` automatically, so you don't need to touch [apps/docs/src/components/shell/Sidebar.tsx](apps/docs/src/components/shell/Sidebar.tsx).

If you're promoting a planned component to ready, just flip `status: 'planned'` → `status: 'ready'` and update `description` if needed.

## 7. Verify

Run these from the repo root in this order. **Stop on first failure** — diagnose before continuing.

```bash
pnpm typecheck       # all three workspaces must pass
pnpm build           # production build of the docs site must succeed
```

Then start the dev server:

```bash
pnpm dev             # → http://localhost:5174
```

Walk through:

- [ ] The component's docs page loads and the `PreviewCard` matches the Figma screenshot from step 1.
- [ ] All variants and sizes render. Compare side-by-side with the screenshot.
- [ ] Toggle the theme via the topbar — both light and dark look correct.
- [ ] Other component pages still render (regression check; the most common breakage is a token rename that affects more than the target component).

## 8. Report back

End the run with a short summary:

- What was synced (component slug + Figma node name).
- Files touched, grouped by package (`packages/tokens/`, `packages/ui/src/<slug>/`, `apps/docs/src/pages/components/<Name>.mdx`, `apps/docs/src/lib/routes.ts`).
- Anything that looked off in the Figma source and needed a judgment call (e.g. "Figma had a 7px radius; rounded to `--radius-md` 6px" or "the disabled state wasn't in the variant set, used 50% opacity to match the existing pattern").
- What's *not* covered yet and would need a follow-up sync.

Do **not** create a commit, branch, or PR. The user reviews the diff manually and decides when (and whether) to commit.
