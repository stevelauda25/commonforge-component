# CENTERNODE-RULES.md — Component spawn rules

**MUST READ before adding/modifying a component in centernode canvas.**

These rules are non-negotiable. Breaking any of them creates the kind of
broken UX that costs a full sprint to debug.

---

## The Three Sacred Rules

### Rule 1 — Variant pill ALWAYS in Props panel

If a component has more than one visual variant (real OR synthetic), the
right-side Props panel MUST include a `variant` pill selector at the top.

- **Real variant prop** (Button: `primary/outline/error`, Dropdown: `default/tags`):
  spawn plain JSX with `variant="..."` — parser detects + manifest promotes
  to enum pills automatically.

- **Synthetic variant prop** (Checkbox: `only/withLabel/withDescription` —
  the underlying API has no `variant` field): spawn a **composite function
  wrapper** so the synthetic `variant` lives in code as a destructured
  param. Parser then detects it as a real prop.

Sidebar showing 3 variant cards is NOT enough. Props panel MUST have the
pill too — that's how the user re-toggles after spawn.

### Rule 2 — Props ↔ Code bidirectional sync

Every prop value visible in the Props panel MUST exist as an editable
expression in the Code tab, and vice versa.

- Editing a prop in the panel → `updateNodeProp` rewrites the matching
  attribute in `node.code` via `updateCodeWithProp`.
- Editing the code in the Code tab → `updateNodeCode` re-parses schema +
  refreshes the panel from the new attribute values.

**Forbidden patterns:**
- Props panel shows a value that isn't anywhere in the code (the panel
  becomes a lie — toggling it doesn't move the canvas).
- Code tab shows a value with no matching panel input (user can't reach it
  via the panel — they have to manually edit code, defeating the panel).
- Hidden synthetic state that's not surfaced to either tab (e.g. internal
  `useState` for a "mode" with no `variant` param) — promote it to a prop.

### Rule 3 — Variant must flow through code

The chosen variant value must appear LITERALLY in the spawned code so the
user can see why the rendered output looks the way it does. Not just a
prop on the wrapper — the variant must show up where it drives behavior.

For synthetic variant composites, this means:

```jsx
function CheckboxExample({ variant = "withLabel", ... }) {
  return (
    <Checkbox
      checked={c}
      label={variant !== 'only' ? label : undefined}
      description={variant === 'withDescription' ? description : undefined}
    />
  );
}
```

Notice `variant` is used directly in the JSX — it's not a hidden config.
Reading the code, the user sees exactly how `variant` controls what
renders.

---

## Spawn pattern cheat sheet

| Component type | Spawn template | Example |
|---|---|---|
| Stateless, real variant prop | Plain JSX | `<Button variant="primary" size="md">Save</Button>` |
| Stateful trigger, real variant prop | Plain JSX (no menu/state) | `<Dropdown variant="default" label="Label" />` |
| Stateless, synthetic variant | Composite function wrapper | `function CheckboxExample({ variant = "withLabel", ... })` |
| Multi-piece interactive (Dropdown w/ menu) | Composite via example chip | Use `examples[]` with explicit `code` field in canvas.ts |

---

## Conditional prop visibility (optional polish)

When a synthetic variant makes a prop irrelevant (e.g. Checkbox `only`
variant doesn't use `label`), HIDE that prop from the Props panel via
`isPropVisibleForVariant()` in [Playground/index.jsx](src/components/Playground/index.jsx).

Pattern:

```js
if (componentName === "CheckboxExample") {
  const variant = currentProps.variant;
  if (propKey === "description" && variant !== "withDescription") return false;
  if (propKey === "label" && variant === "only") return false;
}
```

The prop stays in the spawn code (Rule 2 — bidirectional) but the panel
hides the input so the user isn't confused by a knob that doesn't do
anything in the current variant.

---

## Workflow for adding a new component

1. Build the component in `packages/ui/src/<slug>/`.
2. Write `canvas.ts` (see existing components for shape).
3. **If synthetic variant**: add `variantPresets` AND write
   `build<Name>Composite()` in [CfLibraryPanel.jsx](src/components/Playground/CfLibraryPanel.jsx).
   AND special-case in `variantPropsToJsx()`.
   AND add rule to `isPropVisibleForVariant()` in `index.jsx`.
4. **If real variant**: nothing extra — `variantPropsToJsx()` plain path handles it.
5. Rebuild + copy dist (or `/publish`).
6. Test all 3 rules:
   - Spawn variant card → Props panel shows variant pill ✓
   - Toggle variant pill → Code tab updates ✓
   - Edit Code tab → Props panel updates ✓

---

## Why these rules exist

These were burned in via real user pain:
- Variant pill missing → user had to delete + re-add from sidebar to switch variant. Lost work.
- Props/code drift → user changed prop in panel, canvas didn't update. Confusion.
- Hidden variant config → user couldn't tell why two checkboxes looked different. Wasted debugging.

Every rule was paid for. Don't break them.
