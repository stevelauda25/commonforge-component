# Pagination — SPARC Component Spec

> Sumber: Figma node `96:2316` (distilled JSON + screenshot) + implementasi `pagination.tsx`.
> Status: collected, built, showcased in POD docs as `/components/pagination`.

## 1. Purpose

Table/list footer navigation: page number navigation (Previous / numbers /
Next), rows-per-page selector, "Showing X-Y of Z" summary, dan komposisi
full-width ketiganya.

## 2. Anatomy

| Piece | Component | Notes |
|---|---|---|
| Number page button | `PaginationPageButton` | 28x28, radius 6px, teks 12/16 |
| Nav control | `Pagination` | Row gap 16px, tinggi 28px |
| Rows per page | `PaginationRowsPerPage` | Label + trigger 64x28 + panel ke ATAS |
| Summary | `PaginationSummary` | "Showing X-Y of Z", `#525252` |
| Komposisi | `PaginationFull` | `layout="summary-start" \| "summary-end"` |

## 3. Number page states (KEPUTUSAN — Figma ambigu)

Sel terisolasi di Figma menampilkan tiga sel (bg putih tanpa border / bg
`#F5F5F5` / bg putih + border `rgba(0,0,0,0.1)` 1px) tanpa label state yang
jelas. Mapping yang dipakai (dari demo komposisi, halaman aktif = kotak
border):

| State | Visual |
|---|---|
| `default` | bg `#FFFFFF`, tanpa border, teks `#525252` |
| `hover` | bg `#F5F5F5`, teks `#525252` (juga dipakai CSS `:hover` pada state default) |
| `current` | bg `#FFFFFF` + border `rgba(0,0,0,0.1)` 1px, teks `#000000`, `aria-current="page"` |

Warna teks nomor (`#525252` default / `#000000` current) juga keputusan —
Figma tidak menandai warna teks per state; mengikuti konvensi baris opsi
dropdown (unselected `#525252`, selected `#000000`).

## 4. Pagination (nav control)

- Row: `gap-4` (16px), tinggi 28px, dibungkus `<nav aria-label="Pagination">`.
- Previous: `py-1.5 pl-1.5 pr-2`, gap 4px, chevron-left 16px + teks
  "Previous" `#000000`. Next mirror (`py-1.5 pl-2 pr-1.5`). Hover bg
  `#F5F5F5`; disabled (di halaman pertama/terakhir) teks `#A3A3A3` +
  `cursor-not-allowed` (konvensi disabled ListBase).
- Grup angka di tengah: row `gap-2` (8px).
- Ellipsis: tombol 20x20, radius 6px, ikon `MoreHorizontal` (dots-horizontal)
  16px; hover `#F5F5F5`. Klik melompat `2*siblingCount+1` halaman ke arah
  bloknya (clamped).

## 5. Aturan ellipsis (KEPUTUSAN)

Dengan `siblingCount = s` dan `edgeSize = 2s+1`:

1. `pageCount <= edgeSize*2 + 1` → semua halaman, tanpa ellipsis.
2. Dekat tepi (current di dalam blok tepi) →
   `1 … edgeSize …` + `…` + `N-edgeSize+1 … N`. Contoh Figma persis:
   `s=1, page=1, pageCount=23` → `1 2 3 … 21 22 23`. Blok tepi diperlebar
   bila perlu agar current + siblings selalu terlihat.
3. Tengah → `1 … page-s … page+s … N`.

Helper `getPaginationItems(page, pageCount, siblingCount)` diekspor untuk
testing/demo.

## 6. Rows per page

- Label "Rows per page" `#000000` 12/16; row gap 12px, tinggi 28px.
- Trigger 64x28: space-between, `py-1.5 pl-2 pr-1.5` (6px vertikal / 8px kiri
  / 6px kanan), bg `#FFFFFF`, border `rgba(0,0,0,0.1)` 1px, radius 6px; value
  + chevron-down 12px (berotasi 180° saat terbuka, konvensi dropdown repo).
- Panel: 143px lebar, terbuka ke ATAS trigger (`bottom-full mb-1`), bg putih,
  border black/10 0.5px, radius 6px, shadow popover bersama repo
  (`0 1px 1px, 0 4px 8px, 0 2px 4px` black/5 — resep yang sama dengan
  `dropdown`/`breadcrumb`). Figma menyebut "inset highlight" — resep shadow
  repo dipakai apa adanya (tidak ada inset layer di repo, keputusan disengaja
  agar konsisten).
- Opsi default `[10, 25, 50, 100]`. Baris: padding 8px, teks 12/16; tidak
  terpilih `#525252`; terpilih `#000000` + ikon check 12px trailing;
  hairline `border-b-[0.5px] border-black/10` antar baris (baris terakhir
  tanpa border).

### DEVIASI (disengaja)

Baris terpilih di Figma punya ikon leading `users-01` — artefak placeholder,
TIDAK diikuti. Terpilih = teks `#000000` + trailing check saja.

### Interaksi (mengikuti pola `dropdown` repo)

Klik toggle; outside pointer-down + Escape menutup; ArrowUp/ArrowDown
membuka/memindahkan opsi aktif (wrapping); Enter/Space memilih opsi aktif;
`aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`,
`aria-activedescendant`. Prop `open` memaksa panel terbuka (untuk docs).

## 7. Summary

`PaginationSummary { page, pageSize, total }` → "Showing X-Y of Z",
`#525252` 12/16. State kosong (`total = 0`) → "Showing 0 of 0".

## 8. PaginationFull

Dua susunan Figma (lebar 823px, space-between, tinggi 28px):

- `layout="summary-start"` (default, susunan A): kiri = summary + separator
  "•" + rows-per-page; kanan = pagination.
- `layout="summary-end"` (susunan B): kiri = rows-per-page; kanan =
  pagination + summary (text-right).

Lebar tidak dikunci 823px — `w-full` agar mengikuti container (Figma 823px
hanya ukuran frame demo). Semua props diteruskan ke sub-komponen.

## 9. API / Props

```ts
interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;        // default 1
  previousLabel?: string;       // default "Previous"
  nextLabel?: string;           // default "Next"
  className?: string;
  'aria-label'?: string;
}

interface PaginationRowsPerPageProps {
  value: number;
  options?: number[];           // default [10, 25, 50, 100]
  onChange?: (value: number) => void;
  label?: string;               // default "Rows per page"
  disabled?: boolean;
  open?: boolean;               // force open (docs)
  className?: string;
  'aria-label'?: string;
}

interface PaginationSummaryProps {
  page: number;
  pageSize: number;
  total: number;
  className?: string;
}

interface PaginationFullProps extends Omit<PaginationProps, 'className'> {
  pageSize: number;
  onPageSizeChange?: (value: number) => void;
  pageSizeOptions?: number[];
  total: number;
  layout?: 'summary-start' | 'summary-end';
  rowsPerPageLabel?: string;
  className?: string;
}

interface PaginationPageButtonProps {
  page: number;
  state?: 'default' | 'hover' | 'current';  // 'hover' = forced visual untuk docs
  onClick?: (page: number) => void;
  className?: string;
}
```

Semua komponen controlled (nilai masuk via props, perubahan via callback) —
tidak ada state internal selain open/active pada rows-per-page.

## 10. Ikon

`lucide-react` (set yang sama dengan `dropdown`/`combobox`): `ChevronLeft`,
`ChevronRight`, `ChevronDown`, `MoreHorizontal` (dots-horizontal), `Check`.

## 11. Accessibility

- `<nav aria-label="Pagination">`; tombol angka `aria-label="Page N"` +
  `aria-current="page"` pada current.
- Previous/Next native `<button disabled>`.
- Focus ring: `focus-visible:shadow-[0_0_0_3px_rgba(0,0,0,0.1)]` (resep ring
  input repo).
- Rows-per-page: pola listbox seperti `dropdown` (lihat §6).

## 12. Open Decisions / TBD

1. **Tokenization** — warna masih hardcoded (#525252/#F5F5F5/black/10),
   mengikuti `dropdown`/`list-base`; reconcile ke `gray-*` tokens nanti.
2. **Panel width** — 143px fixed dari Figma; trigger 64px. Bisa dibuat prop
   bila ada kebutuhan.
3. **Ellipsis jump** — saat ini lompat `2*siblingCount+1`; alternatif
   (collapse jadi input "go to page") belum ada di Figma.
