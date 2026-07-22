# CF Design System — Docs Site Design

**Status:** Draft · Awaiting implementation
**Date:** 2026-04-27
**Scope:** New `apps/docs` Vite app — public-facing documentation site for CF Design System
**References:** [kumo-ui.com](https://kumo-ui.com/), [asto-design-system.vercel.app](https://asto-design-system.vercel.app/getting-started)

---

## Goal

Ship a hybrid documentation site for CF Design System: kumo-style component grid on the home page + asto-style sidebar IA with Foundations as a first-class section. The site lives side-by-side with the existing `apps/playground` (which remains untouched as a dev scratchpad).

**Why now:** The current state — 4 components and a single-page playground — has outgrown its review surface. A docs site gives designers, developers, and PMs a shared source of truth, makes the planned roadmap visible (via empty-state component pages), and gives the design system room to grow without rewriting the surface every sprint.

## Non-goals (V1)

- Search across MDX content — defer to V2 (needs Pagefind / FlexSearch + content indexing).
- Auto-generated `<Demo>` macro that serializes JSX children to code — manual code fence is acceptable for V1.
- Auto-generated props table from TypeScript types — manual markdown tables for 4 ready components.
- Per-component "open in playground" deep links.
- Versioning UI (currently v0.1.0; version switcher not needed yet).
- i18n, sitemap, RSS, analytics.
- Static prerender / SSG — SPA is sufficient for V1. If SEO becomes a requirement, evaluate migrating to Astro at that point.
- "Roadmap date" or "voting" UI inside empty states — keep them minimal.
- Replacing or modifying `apps/playground`.

## Architecture

### Project structure

```
pod-design-system/
├── apps/
│   ├── playground/        # unchanged — dev scratchpad
│   └── docs/              # NEW
│       ├── index.html
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       ├── tsconfig.json
│       └── src/
│           ├── main.tsx                    # entry, sets up BrowserRouter
│           ├── App.tsx                     # shell: sidebar + topbar + <Outlet />
│           ├── index.css                   # tailwind base + docs-specific styles
│           ├── lib/
│           │   ├── routes.ts               # single source of truth (nav + routes)
│           │   ├── theme.ts                # light/dark toggle hook
│           │   └── component-status.ts     # 'ready' | 'planned' helpers
│           ├── components/
│           │   ├── shell/
│           │   │   ├── Sidebar.tsx
│           │   │   ├── Topbar.tsx
│           │   │   └── ThemeToggle.tsx
│           │   ├── home/
│           │   │   ├── ComponentGrid.tsx
│           │   │   └── ComponentTile.tsx
│           │   ├── docs/
│           │   │   ├── PageHeader.tsx
│           │   │   ├── PreviewCard.tsx
│           │   │   ├── CodeBlock.tsx
│           │   │   ├── PropsTable.tsx
│           │   │   └── EmptyComponentState.tsx
│           │   └── mdx-components.tsx      # MDXProvider mapping
│           └── pages/
│               ├── Home.tsx
│               ├── GettingStarted.mdx
│               ├── Changelog.mdx
│               ├── foundations/
│               │   ├── Color.mdx
│               │   ├── Typography.mdx
│               │   ├── Spacing.mdx
│               │   ├── Radius.mdx
│               │   └── Elevation.mdx
│               └── components/
│                   ├── Button.mdx          # ready
│                   ├── Checkbox.mdx        # ready
│                   ├── SearchInput.mdx     # ready
│                   ├── Tooltip.mdx         # ready
│                   ├── Badge.mdx           # planned
│                   ├── Select.mdx          # planned
│                   ├── Dropdown.mdx        # planned
│                   ├── Dialog.mdx          # planned
│                   ├── Switch.mdx          # planned
│                   ├── Input.mdx           # planned
│                   ├── Radio.mdx           # planned
│                   └── Label.mdx           # planned
```

### Stack

- `vite` + `@vitejs/plugin-react`
- `@mdx-js/rollup` + `remark-gfm` + `rehype-pretty-code` (Shiki-based syntax highlighting)
- `react-router-dom@6` for routing
- `tailwindcss` + Tailwind preset from `@pod/tokens` (shared with playground)
- `@pod/ui` workspace dep — live demo components imported directly
- `lucide-react` for icons (consistent with playground)

### Single source of truth: `lib/routes.ts`

Central registry consumed by sidebar, home grid, and dynamic route registration.

```ts
type Status = 'ready' | 'planned';
type Category = 'foundation' | 'component' | 'resource';

type RouteEntry = {
  path: string;          // e.g. '/components/button'
  label: string;         // e.g. 'Button'
  category: Category;
  status?: Status;       // only meaningful for components
  description?: string;  // short tagline used in empty-state header
  mdxImport?: () => Promise<typeof import('*.mdx')>;
};

export const routes: RouteEntry[] = [/* ... */];
```

Adding a new component = add one entry. Sidebar order = array order. Status drives both the dot indicator (`●` / `○`) and which template the page renders.

### Theming

Docs site is a *consumer* of `@pod/tokens`, not a redefiner.

- Tailwind config extends the preset from `@pod/tokens` (same as playground).
- `darkMode: 'class'` — toggle `.dark` on `<html>`.
- Default: respect `prefers-color-scheme`. User override persists in `localStorage('pod-docs-theme')`.
- Anti-flash: inline blocking script in `index.html` reads localStorage + system preference and sets `.dark` *before* React mounts.
- Toggle UI: sun/moon icon in topbar, uses `<Button variant="icon">` from `@pod/ui` (dogfooding).
- Docs-specific CSS variables (sidebar bg, code block bg, MDX prose colors) live inline in `apps/docs/src/index.css` for V1. Promote to `@pod/tokens` only when a pattern is reused outside docs.

## Information Architecture

### Sidebar

```
🏠 Home                    /
🚀 Getting Started         /getting-started

FOUNDATIONS              ▾
  🎨 Color                 /foundations/color
  🔤 Typography            /foundations/typography
  📐 Spacing               /foundations/spacing
  ⚪ Radius                 /foundations/radius
  ⬛ Elevation              /foundations/elevation

COMPONENTS               ▾
  ● Button                 /components/button
  ● Checkbox               /components/checkbox
  ● Search Input           /components/search-input
  ● Tooltip                /components/tooltip
  ○ Badge                  /components/badge
  ○ Select                 /components/select
  ○ Dropdown               /components/dropdown
  ○ Dialog                 /components/dialog
  ○ Switch                 /components/switch
  ○ Input                  /components/input
  ○ Radio                  /components/radio
  ○ Label                  /components/label

RESOURCES                ▾
  📄 Changelog             /changelog
  🐙 GitHub                (external)
```

- `●` (filled) = ready, full opacity.
- `○` (outline) = planned, dimmed.
- Sidebar groups are collapsible (`<details>` element, persists state via localStorage).
- Mobile (< 768px): sidebar collapses into an off-canvas drawer triggered by a hamburger button in the topbar.

### Topbar

`[POD logo] Design System              v0.1.0          [☀/🌙]`

Search box deferred to V2. Version label is hardcoded for V1.

### Routes

| Path | Renders | Source |
|---|---|---|
| `/` | Home (kumo grid) | `pages/Home.tsx` |
| `/getting-started` | Getting Started | `pages/GettingStarted.mdx` |
| `/foundations/:slug` | Foundation page | `pages/foundations/{Slug}.mdx` |
| `/components/:slug` | Component page (ready or empty) | `pages/components/{Slug}.mdx` |
| `/changelog` | Changelog | `pages/Changelog.mdx` |
| `*` | 404 | inline component |

## Page templates

### Home (`pages/Home.tsx`)

- Slim hero: title + one-line description.
- `<ComponentGrid>` — responsive 4-column grid (collapses to 2 / 1 on smaller breakpoints).
- Each tile is a `<ComponentTile>`:
  - **Ready**: renders the component's canonical example live, full opacity, clickable → `/components/:slug`.
  - **Planned**: dimmed, dashed border, label "Planned", clickable → `/components/:slug` (which renders the empty state page).
- Tile size constant (min-h `200px`) so the grid stays visually rhythmic regardless of content.

### Foundation page (e.g. `Color.mdx`)

```
PageHeader (title + tagline)
## Semantic tokens          → grid of swatches with name + value
## Light vs dark            → side-by-side comparison
## Usage                    → MDX prose + code blocks
```

Foundation pages are scaffolded from `@pod/tokens` content. Color reads token values directly rather than hardcoding hex.

### Component page — Ready (e.g. `Button.mdx`)

```
PageHeader (title + tagline + [Status: Ready] badge)
<PreviewCard>           ← live demo
  <Button>Click me</Button>
</PreviewCard>

```tsx                  ← syntax-highlighted code (manual, mirrors above)
<Button>Click me</Button>
```

## Variants               → repeat <PreviewCard> + code per variant
## Props                  → markdown table → rendered by PropsTable component
## Accessibility          → MDX prose
```

Content for the four ready components is ported from existing `docs/*.md` files. Per the open-assumptions resolution: the existing markdown files in `docs/button.md`, `docs/checkbox.md`, `docs/search-input.md`, `docs/tooltip.md` move into `apps/docs/src/pages/components/` as `.mdx` and become the single source. The remaining `docs/` content (DESIGN.md, this spec, future specs) stays where it is.

### Component page — Planned (e.g. `Badge.mdx`)

```
PageHeader (title + tagline + [Status: Planned] badge)
<EmptyComponentState />   ← shared, minimal: icon + "Coming Soon" + GitHub issue link
```

Planned MDX files are intentionally lightweight: title, one-line description, single component invocation. All planned pages share the same `<EmptyComponentState>` body.

## Live demo + code block pattern

V1: **author writes the demo twice** — once as live JSX inside `<PreviewCard>`, once as a code fence. This is intentional:

- Zero AST manipulation, zero macro tooling.
- Author retains full control over the displayed code (can simplify it independently of the live demo).
- `rehype-pretty-code` (Shiki) handles syntax highlighting with the same token themes as the live UI.
- Drift risk is acceptable for 4 ready components; revisit when count grows.

V2 deferred: a `<Demo>` macro that serializes JSX children to code via a remark plugin.

`<PreviewCard>` anatomy:
- Slim header with "Preview" label.
- Body: centered children, `min-height: 160px`.
- Background: `--background-bg-subtle` (or equivalent), distinct from page bg.
- Border: `--stroke-default`, radius `--radius-lg`.

`<CodeBlock>` (intercepts `<pre>` from MDX):
- Themes: GitHub Light (light mode) / GitHub Dark Dimmed (dark mode).
- Copy button top-right (visible on hover).
- Language badge top-left (e.g. `tsx`).
- Line numbers off by default; opt-in via prop.

### MDX provider mapping (`mdx-components.tsx`)

```tsx
export const mdxComponents = {
  h1: PageHeader.Title,
  h2: ({ children }) => <h2 className="...">{children}</h2>,
  pre: CodeBlock,
  code: InlineCode,
  table: PropsTable,
  PreviewCard,
  EmptyComponentState,
};
```

`PreviewCard` and `EmptyComponentState` are exposed globally so MDX files don't need per-file imports.

## Deferred (V2+)

- Search across MDX content (Pagefind / FlexSearch).
- Auto `<Demo>` macro.
- Auto props table from TS types.
- Per-component "open in playground" link.
- Versioning UI.
- i18n, sitemap, RSS, analytics.
- Static prerender / SSG.

## Acceptance criteria

- [ ] `pnpm -F docs dev` serves on port 5174 (5173 is playground).
- [ ] `pnpm typecheck` passes for `apps/docs`.
- [ ] Dark mode toggle does not flash on reload.
- [ ] All 4 ready components have a page with live preview + code block + props table + a11y notes.
- [ ] All 8 planned components have a page rendering the shared empty state.
- [ ] All 5 foundation pages exist with content scaffolded from `@pod/tokens`.
- [ ] Sidebar groups (Foundations, Components, Resources) are collapsible.
- [ ] Mobile: sidebar collapses to an off-canvas drawer below 768px.
- [ ] No hex values in MDX content — all styling consumes `@pod/tokens` semantic tokens.
- [ ] Home grid tiles are clickable and route to the corresponding component page.
- [ ] Sidebar uses `●` / `○` to distinguish ready vs planned.
- [ ] `routes.ts` is the single source of truth for sidebar order, navigation, and home grid contents.

## Resolved assumptions

- **Existing `docs/*.md` migration**: ported into `apps/docs/src/pages/components/` as `.mdx`. The component markdown files in `docs/` are removed (single source of truth in the docs app). Other `docs/` content (DESIGN.md, specs) stays put.
- **Mobile pattern**: off-canvas drawer (not top nav).
- **Search**: deferred to V2.
- **Status indicator**: `●` / `○` glyphs (not "Coming Soon" badges).
- **Component roster (initial)**: 4 ready + 8 planned (Badge, Select, Dropdown, Dialog, Switch, Input, Radio, Label).
- **Live demo + code**: author writes both manually for V1.
- **Props table**: manual markdown for V1.
- **Code highlighting**: `rehype-pretty-code` (Shiki).
- **Docs-specific styling**: inline in `apps/docs/src/index.css`, not promoted to `@pod/tokens` until reused outside docs.
