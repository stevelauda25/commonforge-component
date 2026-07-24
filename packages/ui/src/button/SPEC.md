# Button — SPARC Phase-1 Atom Spec

> Sumber: Figma component set "Button" + implementasi `button.tsx`.
> Status: collected, built, showcased in POD docs as `/components/sparc-button`.

## 1. Purpose

Primary action element. Digunakan untuk CTA utama, submit form, atau aksi lain yang butuh emphasis.

## 2. Variants

| Variant | Visual | Use case |
|---|---|---|
| `primary` (default) | Merah solid `#C0180C`, teks putih, gradient + shadow | CTA utama, aksi positif |
| `danger` | Merah solid `#E51D31`, teks putih | Aksi destruktif (delete, remove, revoke) |
| `secondary` | Putih solid, border tipis, teks dark | Aksi sekunder di atas background terang |
| `outline` | Putih, border `#8F8F8F`, teks dark | Aksi low-emphasis |
| `ghost` | Transparent, teks `#525252` | Aksi paling subtle, biasanya di toolbar/list |
| `inverse` | Dark solid `#26201C`, teks putih, border putih/10 | Digunakan di atas background gelap |

## 3. Sizes

| Size | Height | Padding horizontal | Font size | Line height | Icon size |
|---|---|---|---|---|---|
| `xs` | 27px | 8px | 11px (`text-caption`) | 15px | 12px |
| `sm` | 36px | 12px | 12px | 16px | 16px |
| `md` (default) | 44px | 16px | 14px | 20px | 20px |
| `lg` | 56px | 24px | 16px | 24px | 24px |

## 4. States

### 4.1 Default → Hover → Active

- Semua variant punya transition colors.
- Hover: sedikit lebih gelap / berubah transparansi teks.
- Active (pressed): sama dengan hover atau sedikit lebih dim.

### 4.2 Disabled

- Primary / default: background `#F9766C`, teks `text-white/50`, disabled shadow lebih tipis.
- Danger / destructive: background `#F65B68`, teks `text-white/50`.
- Secondary: background `#E0E0E0`, teks `text-primary/30`.
- Outline: border `#C2C2C2`, background `#E0E0E0`, teks `text-primary/30`.
- Ghost: teks `text-primary/30` (background tetap transparent).
- Inverse: background `#26201C`, teks `text-white/30`.

### 4.3 Loading

- `loading={true}`:
  - Menampilkan spinner (`LoaderCircle` dari lucide) di posisi leading icon.
  - Button tetap disabled.
  - `aria-busy="true"`.

## 5. API / Props

```ts
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'default' | 'danger' | 'destructive' | 'secondary' | 'outline' | 'ghost' | 'inverse';
  size?: 'xs' | 'sm' | 'md' | 'default' | 'lg';
  leftIcon?: ReactNode;   // leading icon, auto-sized per size
  rightIcon?: ReactNode;  // trailing icon, auto-sized per size
  loading?: boolean;      // show spinner + disable
  className?: string;
}
```

- `variant="default"` adalah alias backward-compatible untuk `primary`.
- `variant="destructive"` adalah alias backward-compatible untuk `danger`.
- `size="default"` adalah alias backward-compatible untuk `md`.

## 6. Design Tokens (hardcoded values)

> Saat ini masih hardcoded, belum full tokenized ke `packages/tokens`.

| Token purpose | Value | Note |
|---|---|---|
| Primary background | `#C0180C` | SPARC brand red |
| Danger background | `#E51D31` | SPARC danger red |
| Inverse background | `#26201C` | Warm dark |
| Secondary/outline border | `border-white/10`, `border-[#8F8F8F]` |  |
| Disabled primary bg | `#F9766C` |  |
| Disabled primary text | `text-white/50` |  |
| Focus ring | `ring-2 ring-black/25` |  |
| Border radius | `rounded-[6px]` |  |
| Shadow recipe | 3 drop shadows + 3 inner shadows | Lihat `BUTTON_SHADOW` di `button.tsx` |

## 7. Accessibility

- Native `<button>` element.
- `focus-visible:ring-2 focus-visible:ring-black/25`.
- `disabled:pointer-events-none`.
- Loading state: `aria-busy="true"`, button disabled.
- Icon-only button: consumer wajib menyertakan `aria-label`.

## 8. Usage Examples

```tsx
import { Button } from '@commonforge/ui';
import { Plus, ArrowRight } from 'lucide-react';

<Button>Primary</Button>
<Button variant="danger">Delete</Button>
<Button size="sm">Small</Button>
<Button loading>Saving...</Button>
<Button leftIcon={<Plus size={16} />}>Add</Button>
<Button rightIcon={<ArrowRight size={16} />}>Next</Button>
```

## 9. Open Decisions / TBD

1. **Purple?** — Tidak ada. Tidak pernah ada. Primary = red `#C0180C`.
2. **Full width?** — Default-nya intrinsic (hug content). Full width bisa dicapai dengan `className="w-full"`.
3. **Tokenization** — Warna, shadow, dan radius masih hardcoded. Perlu dipindah ke `packages/tokens` saat merge ke `design-system`.
4. **Alias cleanup** — `default` dan `destructive` alias bisa dihapus setelah tidak ada consumer legacy.

## 10. Figma Source

- Figma component set: **Button**
- Node reference: tidak ada di `button.tsx` (hanya deskripsi). Jika ada node ID spesifik dari Figma export, bisa ditambahkan di sini.
