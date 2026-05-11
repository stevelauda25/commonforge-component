# Prompt: Integrasi `pod-test-ui` ke Project Client

> **Cara pakai prompt ini:** Copy-paste seluruh isi file ini ke AI agent (Claude, Cursor, Copilot, dll) di project client. AI akan tau cara setup & pakai library-nya tanpa perlu nebak.

---

Kamu bertugas mengintegrasikan **design system POD** (`pod-test-ui` + `pod-test-tokens`) ke dalam project React client ini. Library ini adalah projection dari Figma — komponen-komponennya udah token-driven, dark-mode-ready, dan accessibility-aware.

## 1. Persyaratan Stack Wajib

Sebelum apapun, **verifikasi project client memenuhi syarat ini**:

| Requirement | Versi | Kenapa |
|---|---|---|
| React | `^18.2.0` | Peer dependency |
| React-DOM | `^18.2.0` | Peer dependency |
| **Tailwind CSS** | **`^3.4.0` (v3)** | Versi `pod-test-ui` saat ini ship **JS preset** (v3 model). Tailwind v4 valid & terbaru, tapi pakai CSS `@theme` directive — preset JS-nya gak ke-load. Sampai library publish entry `v4-theme.css`, client harus pakai v3. |
| PostCSS | `^8.x` | Untuk Tailwind |
| Build tool | Vite, Next.js, atau setara | Apa pun yang bisa proses TS + CSS |

### ⚠️ KRITIKAL: JANGAN MIX v3 dengan `@tailwindcss/postcss` (v4)

Kalau `@tailwindcss/postcss` ada di `devDependencies` (bahkan kalau `tailwindcss@3.4.x` juga ada), **HAPUS plugin v4-nya** sebelum lanjut. PostCSS akan auto-load engine v4 dan **mengabaikan total** `tailwind.config.js` — akibatnya semua kelas dari preset (`bg-accent`, `border-border-default`, dll) gak ke-generate, komponen muncul tanpa style.

> Note: ini bukan masalah v4-nya — v4 adalah versi stabil terbaru. Masalahnya: library `pod-test-ui` versi sekarang ship preset JS untuk v3. Versi mendatang akan ship dual entry (v3 preset + v4 `@theme.css`). Untuk sekarang, pilih satu jalur: **murni v3** (recommended), atau tunggu rilis library v4-compatible.

```bash
npm uninstall @tailwindcss/postcss   # kalau ada
```

## 2. Install

```bash
npm i pod-test-ui pod-test-tokens
npm i -D tailwindcss@^3.4.0 postcss autoprefixer
```

## 3. Konfigurasi (4 file)

### 3.1 `postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3.2 `tailwind.config.js`

Wajib pakai preset dari `pod-test-tokens` supaya semua design token (colors, radius, shadows, motion) terpetakan ke utility class.

```js
import preset from 'pod-test-tokens/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // WAJIB — supaya Tailwind scan classnames dari komponen library
    './node_modules/pod-test-ui/**/*.{js,mjs}',
  ],
};
```

### 3.3 Entry CSS (mis. `src/index.css`)

Urutan import-nya **wajib**: `theme.css` dulu (define CSS variables), baru directive Tailwind.

```css
@import 'pod-test-tokens/theme.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional — kalau mau body pake background canvas + text primary */
:root {
  background-color: rgb(var(--color-bg-canvas));
  color: rgb(var(--color-text-primary));
  font-family: Inter, system-ui, -apple-system, sans-serif;
}
```

> **Salah satu kegagalan umum**: pakai `var(--canvas)` atau `var(--text-primary)`. Variable yang BENAR adalah `--color-bg-canvas` dan `--color-text-primary` (semua punya prefix `--color-`).

### 3.4 Entry app (mis. `src/main.tsx`)

Import CSS sebelum render — pastiin theme variables siap sebelum komponen mount.

```tsx
import './index.css';   // ← berisi import theme.css + tailwind directives
import App from './App';
// ...
```

## 4. Pemakaian Komponen

```tsx
import { Button, Checkbox, SearchInput, Tooltip } from 'pod-test-ui';
```

### 4.1 `<Button>`

| Prop | Tipe | Default | Catatan |
|---|---|---|---|
| `variant` | `'primary' \| 'outline' \| 'error'` | `'primary'` | |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | |
| `iconOnly` | `boolean` | `false` | Square button (h=w), pakai bareng `leftIcon` aja |
| `loading` | `boolean` | `false` | Render spinner, auto-disable |
| `leftIcon` / `rightIcon` | `React.ReactNode` | — | Pakai komponen icon (lucide-react direkomendasi) |
| `disabled` | `boolean` | `false` | |
| ...semua HTML `<button>` props | | | `onClick`, `type`, `aria-*`, dst |

```tsx
<Button>Default</Button>
<Button variant="outline" size="sm">Outline</Button>
<Button variant="error" leftIcon={<Trash2 size={16} />}>Hapus</Button>
<Button loading>Menyimpan…</Button>
<Button iconOnly leftIcon={<Settings size={16} />} aria-label="Settings" />
```

### 4.2 `<Checkbox>` — controlled only

| Prop | Tipe | Wajib | Catatan |
|---|---|---|---|
| `checked` | `boolean \| 'indeterminate'` | ✓ | |
| `onCheckedChange` | `(checked: boolean) => void` | — | |
| `label` | `ReactNode` | — | |
| `description` | `ReactNode` | — | Teks bantuan di bawah label |
| `error` | `string` | — | Pesan error, men-style red |

```tsx
const [agree, setAgree] = useState<boolean | 'indeterminate'>(false);

<Checkbox
  checked={agree}
  onCheckedChange={setAgree}
  label="Saya setuju dengan syarat & ketentuan"
  description="Termasuk privacy policy & data handling."
/>
```

### 4.3 `<SearchInput>` — controlled only

| Prop | Tipe | Wajib | Catatan |
|---|---|---|---|
| `value` | `string` | ✓ | |
| `onValueChange` | `(v: string) => void` | ✓ | Fires saat user ngetik & saat clear |
| `clearable` | `boolean` | — | Default `true` — tombol clear muncul saat ada value |
| `size` | `'sm' \| 'md'` | — | |
| `leftIcon` | `ReactNode` | — | Override icon kiri (default: magnifier) |
| `error` | `string` | — | |
| `placeholder` | `string` | — | Standard HTML attribute |

```tsx
const [q, setQ] = useState('');

<SearchInput
  value={q}
  onValueChange={setQ}
  placeholder="Cari produk…"
/>
```

### 4.4 `<Tooltip>` — wraps a single focusable element

| Prop | Tipe | Default | Catatan |
|---|---|---|---|
| `content` | `ReactNode` | — wajib | |
| `children` | `ReactElement` | — wajib | **Single child only** (button, anchor) — bukan div |
| `variant` | `'default' \| 'info' \| 'warning' \| 'error'` | `'default'` | |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | |
| `sideOffset` | `number` | `8` | |
| `delayDuration` | `number` (ms) | `400` | |

```tsx
<Tooltip content="Hapus permanen" variant="error">
  <Button iconOnly variant="outline" leftIcon={<Trash2 size={16} />} />
</Tooltip>
```

> **Aksesibilitas Tooltip**: Radix-driven. Trigger HARUS focusable (button, anchor, atau elemen dengan `tabIndex`). Tooltip tidak akan render di atas `<div>` biasa.

## 5. Dark Mode

Toggle class `dark` di `<html>`:

```tsx
document.documentElement.classList.toggle('dark');
```

Atau ikuti preferensi OS:

```tsx
useEffect(() => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = () => document.documentElement.classList.toggle('dark', mq.matches);
  apply();
  mq.addEventListener('change', apply);
  return () => mq.removeEventListener('change', apply);
}, []);
```

Komponen-komponen design system **tidak perlu** edit apapun — semua referensi semantic token, dan token swap value-nya saat `.dark` aktif.

## 6. Aturan Styling Custom (override)

Setiap komponen menerima `className` — di-merge dengan `tailwind-merge` jadi konflik utility ke-resolve dengan benar (override-mu menang):

```tsx
<Button className="w-full">Submit</Button>           {/* OK — width override */}
<Button className="bg-purple-600">Custom</Button>    {/* OK — bg override */}
```

### ❌ JANGAN

- **Hardcode hex / rgb** — pakai semantic token via class:
  ```tsx
  <div className="bg-[#16a34a]">…</div>      // ❌
  <div className="bg-accent">…</div>          // ✓
  ```
- **Pakai class `dark:*` sendiri** — semua komponen sudah theme-agnostic via CSS variables. Override class manual cuma pakai class biasa, tokens swap otomatis di dark mode.
- **Modifikasi file di `node_modules/pod-test-ui/`** — perubahan akan hilang saat reinstall. Kalau butuh varian baru, request ke maintainer design system.

## 7. Token Reference (semantic tokens yang available)

Pakai sebagai kelas Tailwind: `bg-canvas`, `text-text-muted`, `border-border-default`, dst.

**Backgrounds:** `canvas`, `surface`, `raised`, `muted`
**Text:** `text-primary`, `text-secondary`, `text-muted`, `text-disabled`, `text-inverse`
**Borders:** `border-subtle`, `border-default`, `border-strong`, `border-focus`
**Accent:** `accent`, `accent-hover`, `accent-active`, `accent-fg`, `accent-subtle`
**Feedback:** `danger`, `warning`, `success`, `info` (masing-masing punya `-hover`, `-active`, `-fg`, `-subtle`)
**Radius:** `rounded-sm | md | lg | xl | full`
**Shadows:** `shadow-sm | md | lg`, plus `shadow-glow-accent-inset`, `shadow-glow-accent-inset-strong`, `shadow-glow-danger-inset`, `shadow-glow-danger-inset-strong`
**Motion:** `duration-fast | base | slow`, `ease-standard | emphasized | press`

## 8. Verifikasi Setup Berhasil

Setelah setup, jalanin dev server, lalu cek di browser DevTools:

1. **CSS Tailwind tergenerate v3?**
   Lihat top comment di stylesheet — harus `tailwindcss v3.4.x`. Kalau `v4.x.x`, pasti masih ada `@tailwindcss/postcss` di deps — uninstall.

2. **Theme variables ada?**
   Inspect `<html>` → DevTools Computed → cari `--color-accent-default`. Kalau gak ada, `theme.css` belum ke-import.

3. **Komponen ter-style?**
   Render `<Button variant="primary">Test</Button>`. Harus muncul **tombol hijau dengan glow inset**, bukan tombol default browser.

Kalau gagal di salah satu step, JANGAN coba style manual. Investigasi root cause — biasanya satu dari:
- Tailwind v4 nyelinap (cek #1 di atas)
- `content` array di tailwind config gak include `node_modules/pod-test-ui`
- `theme.css` belum ke-import sebelum directive Tailwind
- Variable name salah ketik (harus `--color-bg-canvas`, BUKAN `--canvas`)

## 9. Yang Tidak Termasuk Library Ini (Untuk Sekarang)

Komponen yang **belum** ada — kalau project butuh, build sendiri pakai token system, atau request ke maintainer:
- Modal / Dialog
- Select / Combobox / Dropdown
- DatePicker
- Table / DataGrid
- Tabs
- Toast / Notification
- Form primitives (`Label`, `Field`, `HelperText`)

## 10. Update Library

```bash
npm update pod-test-ui pod-test-tokens
```

Token rename / breaking changes akan di-bump di major version. Selalu baca changelog sebelum update.

---

**Selesai.** Setelah ngikutin step di atas, kamu udah siap pakai library. Mulai dari ngeganti tombol-tombol native di project dengan `<Button>`, terus ekspand ke form input. Kalau nemu komponen yang belum ada di library, jangan replicate — request, atau build sebagai komponen lokal yang konsumsi token system yang sama.
