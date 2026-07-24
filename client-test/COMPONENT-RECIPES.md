# `@commonforge/ui` — Recipes & Patterns

Practical UI patterns built from the 4 available components: `Button`, `Checkbox`, `SearchInput`, `Tooltip`.

> **How to read this file:**
> - **Prompt** — paste this to your AI agent (Claude, Cursor, Copilot) when you want this pattern.
> - **Code** — the expected output. Drop into your project as-is, or use as a reference.
> - **Notes** — accessibility rules, dark-mode behavior, common mistakes.

Prerequisites assumed: project is set up per `CLIENT-PROMPT.md` (Tailwind v3 + `@commonforge/tokens` preset wired up).

---

## 1. App Header (Logo + Search + Action Bar)

**Prompt:**
> Build an app header using `@commonforge/ui`. It should contain: a logo on the left, a search input in the center (max-width 480px), and three icon-only buttons on the right (notifications, settings, sign-out) — each wrapped in a `Tooltip`. Sticky at the top. Use semantic tokens only.

**Code:**

```tsx
import { Button, SearchInput, Tooltip } from '@commonforge/ui';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export function AppHeader() {
  const [query, setQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 border-b border-border-default bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <a href="/" className="text-lg font-semibold text-text-primary">
          POD
        </a>

        <div className="mx-auto w-full max-w-[480px]">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search projects, docs, people…"
            size="sm"
          />
        </div>

        <nav className="flex items-center gap-1">
          <Tooltip content="Notifications">
            <Button variant="outline" size="sm" iconOnly leftIcon={<Bell size={16} />} aria-label="Notifications" />
          </Tooltip>
          <Tooltip content="Settings">
            <Button variant="outline" size="sm" iconOnly leftIcon={<Settings size={16} />} aria-label="Settings" />
          </Tooltip>
          <Tooltip content="Sign out">
            <Button variant="outline" size="sm" iconOnly leftIcon={<LogOut size={16} />} aria-label="Sign out" />
          </Tooltip>
        </nav>
      </div>
    </header>
  );
}
```

**Notes:**
- `bg-canvas/80 backdrop-blur` — opacity modifier works because tokens are stored as `R G B` triples.
- Every icon-only button needs `aria-label` (Tooltip's `content` is *not* a label for screen readers).
- `border-b border-border-default` — single source of truth, swaps in dark mode automatically.

---

## 2. Search + Filter Toolbar

**Prompt:**
> Create a toolbar with a search input on the left and three filter toggle buttons on the right (`All`, `Active`, `Archived`). The active filter should look pressed. Use `outline` variant for the inactive ones and `primary` for active.

**Code:**

```tsx
import { Button, SearchInput } from '@commonforge/ui';
import { useState } from 'react';

type Filter = 'all' | 'active' | 'archived';

export function ProjectsToolbar() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filters: Array<{ value: Filter; label: string }> = [
    { value: 'all',      label: 'All' },
    { value: 'active',   label: 'Active' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border-default bg-surface p-3">
      <div className="min-w-[240px] flex-1">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Filter projects…"
          size="sm"
        />
      </div>

      <div className="flex items-center gap-1">
        {filters.map(({ value, label }) => (
          <Button
            key={value}
            variant={filter === value ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
```

**Notes:**
- `aria-pressed` is the right ARIA for toggle-style buttons.
- Don't manually swap classes for "selected" state — use `variant` switching. The component handles styling.

---

## 3. Settings Card (Multiple Checkboxes + Save)

**Prompt:**
> Build a "Notification Preferences" card with four checkbox rows — each with a label, a description, and a state. At the bottom: an outline `Cancel` button and a primary `Save changes` button. Show a loading spinner on Save while submitting.

**Code:**

```tsx
import { Button, Checkbox } from '@commonforge/ui';
import { useState } from 'react';

type Prefs = {
  emailDigest:  boolean | 'indeterminate';
  pushUpdates:  boolean | 'indeterminate';
  weeklyReport: boolean | 'indeterminate';
  productNews:  boolean | 'indeterminate';
};

export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Prefs>({
    emailDigest:  true,
    pushUpdates:  false,
    weeklyReport: 'indeterminate',
    productNews:  false,
  });
  const [saving, setSaving] = useState(false);

  const update = (key: keyof Prefs) => (checked: boolean) =>
    setPrefs((p) => ({ ...p, [key]: checked }));

  const onSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/me/notifications', { method: 'PUT', body: JSON.stringify(prefs) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 rounded-xl border border-border-default bg-surface p-6">
      <header>
        <h2 className="text-lg font-semibold text-text-primary">Notification preferences</h2>
        <p className="text-sm text-text-muted">Choose what you'd like to hear from us about.</p>
      </header>

      <div className="flex flex-col gap-4">
        <Checkbox
          checked={prefs.emailDigest}
          onCheckedChange={update('emailDigest')}
          label="Email digest"
          description="A weekly summary of activity in your projects."
        />
        <Checkbox
          checked={prefs.pushUpdates}
          onCheckedChange={update('pushUpdates')}
          label="Push notifications"
          description="Real-time alerts on your devices."
        />
        <Checkbox
          checked={prefs.weeklyReport}
          onCheckedChange={update('weeklyReport')}
          label="Weekly performance report"
          description="Indeterminate state shown — partial selection across teams."
        />
        <Checkbox
          checked={prefs.productNews}
          onCheckedChange={update('productNews')}
          label="Product news"
          description="Major releases and feature announcements."
        />
      </div>

      <footer className="flex justify-end gap-2 border-t border-border-subtle pt-4">
        <Button variant="outline" disabled={saving}>Cancel</Button>
        <Button variant="primary" loading={saving} onClick={onSave}>
          Save changes
        </Button>
      </footer>
    </section>
  );
}
```

**Notes:**
- `Checkbox` is **controlled-only** — you must own state. Pass `boolean | 'indeterminate'`.
- `onCheckedChange` always returns `boolean` (from `'indeterminate'` it goes to `true`).
- `loading` on Button auto-disables it and renders a spinner — don't add manual `disabled={loading}`.

---

## 4. Confirmation Row (Destructive Action)

**Prompt:**
> Render a destructive confirmation row: a warning message on the left, then `Cancel` (outline) and `Delete` (error variant) buttons on the right. The Delete button has a tooltip explaining the action is permanent.

**Code:**

```tsx
import { Button, Tooltip } from '@commonforge/ui';
import { Trash2 } from 'lucide-react';

type Props = { onCancel: () => void; onConfirm: () => void };

export function DeleteConfirmation({ onCancel, onConfirm }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-danger/40 bg-danger-subtle p-4">
      <p className="text-sm text-text-primary">
        This will permanently delete the project and all its issues. This action cannot be undone.
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Tooltip content="This is permanent — there is no undo." variant="error">
          <Button
            variant="error"
            size="sm"
            leftIcon={<Trash2 size={14} />}
            onClick={onConfirm}
          >
            Delete project
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
```

**Notes:**
- `border-danger/40` — alpha modifier on a semantic token.
- Tooltip wraps the Button (a focusable element); won't work over a `div`.
- `variant="error"` on Tooltip uses the danger color scheme — visually pairs with the destructive Button.

---

## 5. Empty State (Search Results)

**Prompt:**
> Build an empty-state for when a search returns no results. Center an icon, a heading, a description, and a `Clear search` outline button.

**Code:**

```tsx
import { Button } from '@commonforge/ui';
import { SearchX } from 'lucide-react';

type Props = { query: string; onClear: () => void };

export function NoResults({ query, onClear }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border-default bg-surface px-6 py-16 text-center">
      <SearchX size={32} className="text-text-muted" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-text-primary">
          No results for "{query}"
        </h3>
        <p className="max-w-sm text-sm text-text-muted">
          Try a shorter query, check your spelling, or clear the search to see everything.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onClear}>
        Clear search
      </Button>
    </div>
  );
}
```

**Notes:**
- Color icons with `text-*` tokens (icons inherit `currentColor` by default in lucide-react).
- `aria-hidden` on decorative icons — they're not labels.

---

## 6. Inline Form with Validation

**Prompt:**
> Build an inline subscribe form: a `SearchInput`-style email input on the left (no magnifier — just plain), a `Subscribe` button on the right. Show error states under the input when validation fails. The checkbox `I agree to receive marketing emails` is required.

**Code:**

```tsx
import { Button, Checkbox, SearchInput } from '@commonforge/ui';
import { Mail } from 'lucide-react';
import { useState } from 'react';

export function SubscribeForm() {
  const [email, setEmail]   = useState('');
  const [agree, setAgree]   = useState<boolean | 'indeterminate'>(false);
  const [error, setError]   = useState<string | undefined>();
  const [agreeErr, setAgreeErr] = useState<string | undefined>();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setAgreeErr(undefined);

    if (!email.includes('@'))      setError('Please enter a valid email.');
    if (!agree || agree === 'indeterminate') setAgreeErr('You must agree before subscribing.');
    if (email.includes('@') && agree === true) {
      // submit…
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-lg border border-border-default bg-surface p-6">
      <h2 className="text-lg font-semibold text-text-primary">Subscribe to updates</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <SearchInput
            value={email}
            onValueChange={setEmail}
            placeholder="you@example.com"
            leftIcon={<Mail size={16} />}
            error={error}
            aria-label="Email address"
          />
        </div>
        <Button type="submit" variant="primary">
          Subscribe
        </Button>
      </div>

      <Checkbox
        checked={agree}
        onCheckedChange={setAgree}
        label="I agree to receive marketing emails"
        description="Unsubscribe anytime — we won't share your address."
        error={agreeErr}
      />
    </form>
  );
}
```

**Notes:**
- `SearchInput` `leftIcon` overrides the default magnifier — use any lucide icon.
- Form-level validation: clear all errors first, then re-set them. Don't rely on previous render's error state.
- `error` prop on both `SearchInput` and `Checkbox` styles the field red **and** renders the message below.

---

## 7. Sticky Action Bar (Bottom of Long Form)

**Prompt:**
> At the bottom of a long settings page, render a sticky action bar that says "You have unsaved changes" on the left, with `Discard` (outline) and `Save` (primary, loading-aware) on the right. The bar should sit above the page content with a top border and a soft shadow.

**Code:**

```tsx
import { Button } from '@commonforge/ui';

type Props = {
  saving: boolean;
  onDiscard: () => void;
  onSave: () => void;
};

export function UnsavedChangesBar({ saving, onDiscard, onSave }: Props) {
  return (
    <div className="sticky bottom-0 z-30 -mx-6 mt-8 border-t border-border-default bg-raised/90 px-6 py-3 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-text-secondary">You have unsaved changes.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onDiscard} disabled={saving}>
            Discard
          </Button>
          <Button variant="primary" size="sm" loading={saving} onClick={onSave}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Notes:**
- `bg-raised/90` (90% opacity) + `backdrop-blur` — readable over scrolling content.
- `-mx-6 ... px-6` — break out of the parent's padding so the bar spans full width while content beside it remains constrained.

---

## 8. Icon-Only Toolbar (Editor Pattern)

**Prompt:**
> A horizontal toolbar with 6 icon-only buttons: undo, redo, bold, italic, link, and delete. Group them with vertical separators between logical sections (history, formatting, danger). Every button has a tooltip with its keyboard shortcut.

**Code:**

```tsx
import { Button, Tooltip } from '@commonforge/ui';
import { Undo2, Redo2, Bold, Italic, Link2, Trash2 } from 'lucide-react';

const Sep = () => <span className="mx-1 h-5 w-px bg-border-default" aria-hidden="true" />;

type IconBtnProps = {
  label: string;
  shortcut: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'outline' | 'error';
};

const IconBtn = ({ label, shortcut, icon, onClick, variant = 'outline' }: IconBtnProps) => (
  <Tooltip content={`${label} (${shortcut})`}>
    <Button variant={variant} size="sm" iconOnly leftIcon={icon} onClick={onClick} aria-label={label} />
  </Tooltip>
);

export function EditorToolbar() {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-border-default bg-surface p-1">
      <IconBtn label="Undo"   shortcut="⌘Z"      icon={<Undo2 size={14} />}  onClick={() => {}} />
      <IconBtn label="Redo"   shortcut="⇧⌘Z"     icon={<Redo2 size={14} />}  onClick={() => {}} />
      <Sep />
      <IconBtn label="Bold"   shortcut="⌘B"      icon={<Bold size={14} />}   onClick={() => {}} />
      <IconBtn label="Italic" shortcut="⌘I"      icon={<Italic size={14} />} onClick={() => {}} />
      <IconBtn label="Link"   shortcut="⌘K"      icon={<Link2 size={14} />}  onClick={() => {}} />
      <Sep />
      <IconBtn label="Delete" shortcut="⌘⌫"      icon={<Trash2 size={14} />} onClick={() => {}} variant="error" />
    </div>
  );
}
```

**Notes:**
- Tooltip content combines label + shortcut so screen-reader-aware users still get the action name via `aria-label`, while sighted users see both.
- A separator is just a styled `<span>` with `bg-border-default` — no need to introduce a new primitive.

---

## 9. Dark Mode Toggle

**Prompt:**
> Add a button that toggles between light and dark mode. Use `Tooltip` to show the current mode, and switch the icon between sun/moon.

**Code:**

```tsx
import { Button, Tooltip } from '@commonforge/ui';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <Tooltip content={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Button
        variant="outline"
        size="sm"
        iconOnly
        leftIcon={dark ? <Sun size={16} /> : <Moon size={16} />}
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle color theme"
      />
    </Tooltip>
  );
}
```

**Notes:**
- The `dark` class on `<html>` is what the design system listens for. **Never** add `dark:*` modifiers in component code — tokens swap automatically.
- Persist user choice to `localStorage` if you want it to survive reloads.

---

## 10. Loading & Disabled Patterns

**Quick reference — when to use which prop:**

| State | Button prop | Visual | Effect |
|---|---|---|---|
| Submitting | `loading={true}` | Spinner replaces left icon | Auto-disabled, `aria-busy="true"` |
| Permanently disabled | `disabled={true}` | Faded, no spinner | Native disabled |
| Pending data | `disabled={!data}` | Faded | Same as above — gate on real conditions |

```tsx
{/* Right */}
<Button loading={submitting} onClick={submit}>Save</Button>

{/* Wrong — manual spinner duplicates loading state */}
<Button disabled={submitting} leftIcon={submitting ? <Spinner /> : <Save />}>Save</Button>
```

---

## Anti-Patterns (What Not to Generate)

When generating UI from these prompts, **never produce**:

```tsx
// ❌ Hardcoded hex / rgb
<div className="bg-[#16a34a]">…</div>
<button style={{ background: 'green' }}>…</button>

// ❌ Manual dark: variants
<div className="bg-white dark:bg-zinc-900">…</div>

// ❌ Wrapping a non-focusable element in Tooltip
<Tooltip content="Info"><div>hover me</div></Tooltip>

// ❌ Stacking disabled + loading
<Button disabled={isLoading} loading={isLoading}>…</Button>

// ❌ Building a custom Checkbox/Button/SearchInput from scratch
<input type="checkbox" className="..." />   // use <Checkbox> instead

// ❌ Importing internal paths
import { Button } from '@commonforge/ui/dist/button';   // use top-level only
```

**Always prefer:**

```tsx
// ✓ Semantic token classes
<div className="bg-accent text-accent-fg">…</div>

// ✓ Tokens swap automatically — no dark: needed
<div className="bg-canvas text-text-primary">…</div>

// ✓ Tooltip on focusable element
<Tooltip content="Info"><Button iconOnly leftIcon={<Info />} aria-label="Info" /></Tooltip>

// ✓ Use library components for what they exist for
<Checkbox checked={x} onCheckedChange={setX} label="…" />

// ✓ Top-level imports
import { Button, Tooltip } from '@commonforge/ui';
```

---

## How to Request New Patterns

If your screen needs a primitive not in this library (Modal, Select, Tabs, Toast, Table…), **don't** synthesize one. Either:

1. Build a local component in your project that consumes the same token system (`bg-canvas`, `text-text-primary`, etc.).
2. Open a request to the design system maintainer.

Component requests should include: a Figma frame or screenshot, the props/variants needed, and the use case. Maintainer ships it in the next library release.
