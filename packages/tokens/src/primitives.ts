/**
 * Primitive tokens — raw color scales.
 *
 * Values are stored as "R G B" triples (not `#hex`) so they can be wrapped in
 * `rgb(<var> / <alpha>)` downstream. This is what makes classes like
 * `bg-accent/80` work in Tailwind without maintaining a second opacity scale.
 *
 * Components should NEVER import this file directly. Consume the semantic
 * Tailwind classes (bg-canvas, text-primary, …) defined in tailwind-preset.ts.
 */
export const primitives = {
  neutral: {
    0:   '255 255 255',
    50:  '250 250 250',
    100: '244 244 245',
    200: '228 228 231',
    300: '212 212 216',
    400: '161 161 170',
    500: '113 113 122',
    600: '82 82 91',
    700: '63 63 70',
    800: '39 39 42',
    900: '24 24 27',
    950: '9 9 11',
  },
  blue: {
    50:  '239 246 255',
    100: '219 234 254',
    200: '191 219 254',
    300: '147 197 253',
    400: '96 165 250',
    500: '59 130 246',
    600: '37 99 235',
    700: '29 78 216',
    800: '30 64 175',
    900: '30 58 138',
  },
  green: {
    50:  '240 253 244',
    100: '220 252 231',
    200: '187 247 208',
    300: '134 239 172',
    400: '74 222 128',
    500: '34 197 94',
    600: '22 163 74',
    700: '21 128 61',
    800: '22 101 52',
    900: '20 83 45',
  },
  red: {
    50:  '254 242 242',
    100: '254 226 226',
    500: '239 68 68',
    600: '220 38 38',
    700: '185 28 28',
  },
  yellow: {
    50:  '254 252 232',
    100: '254 249 195',
    500: '234 179 8',
    600: '202 138 4',
    700: '161 98 7',
  },
  cyan: {
    50:  '236 254 255',
    100: '207 250 254',
    500: '6 182 212',
    600: '8 145 178',
    700: '14 116 144',
  },
} as const;

export type Primitives = typeof primitives;
