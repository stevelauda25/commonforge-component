# Figma token exports

Canonical Figma variable exports in W3C Tokens Studio format. These three
files are the source of truth for the color section of `../src/theme.css`.

- `Mode 1.tokens.json` — 297 primitives across 27 chromatic ramps + alpha + base
- `Light Theme.tokens.json` — 93 semantic tokens (`bg`, `border`, `fg`, `icon`, `text`) for light mode
- `Dark Theme.tokens.json` — same semantic structure for dark mode

When Figma changes, replace these files and update `theme.css` to match.
Do not hand-edit these files.
