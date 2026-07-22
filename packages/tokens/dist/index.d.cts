export { default as preset, default as tailwindPreset } from './tailwind-preset.cjs';
import 'tailwindcss';

/**
 * Primitive tokens — raw color scales.
 *
 * Values are stored as "R G B" triples so they can be wrapped in
 * `rgb(<var> / <alpha>)` downstream. Generated from foundation/tokens.json.
 */
declare const primitives: {
    readonly neutral: {
        readonly 25: "251 250 249";
        readonly 50: "246 244 241";
        readonly 100: "239 235 230";
        readonly 200: "226 220 212";
        readonly 300: "207 199 188";
        readonly 400: "176 166 153";
        readonly 500: "139 129 117";
        readonly 600: "107 98 89";
        readonly 700: "78 70 64";
        readonly 800: "53 46 41";
        readonly 900: "38 32 28";
        readonly 950: "32 27 24";
    };
    readonly crimson: {
        readonly 25: "255 245 244";
        readonly 50: "255 227 225";
        readonly 100: "254 208 205";
        readonly 200: "252 162 156";
        readonly 300: "249 118 108";
        readonly 400: "245 73 61";
        readonly 500: "192 24 12";
        readonly 600: "152 21 11";
        readonly 700: "114 16 9";
        readonly 800: "94 14 8";
        readonly 900: "74 12 7";
        readonly 950: "55 9 6";
    };
    readonly green: {
        readonly 25: "236 253 243";
        readonly 50: "210 248 224";
        readonly 100: "168 239 198";
        readonly 200: "114 224 166";
        readonly 300: "65 203 133";
        readonly 400: "31 176 107";
        readonly 500: "18 148 87";
        readonly 600: "14 120 71";
        readonly 700: "12 94 57";
        readonly 800: "10 74 45";
        readonly 900: "8 58 36";
        readonly 950: "5 39 24";
    };
    readonly amber: {
        readonly 25: "255 248 230";
        readonly 50: "253 236 190";
        readonly 100: "250 216 132";
        readonly 200: "245 194 74";
        readonly 300: "239 173 32";
        readonly 400: "229 156 14";
        readonly 500: "209 139 12";
        readonly 600: "174 114 10";
        readonly 700: "139 91 8";
        readonly 800: "111 73 6";
        readonly 900: "89 59 5";
        readonly 950: "62 41 4";
    };
    readonly red: {
        readonly 25: "255 240 241";
        readonly 50: "255 218 221";
        readonly 100: "255 184 190";
        readonly 200: "251 138 147";
        readonly 300: "246 91 104";
        readonly 400: "241 53 70";
        readonly 500: "229 29 49";
        readonly 600: "194 21 42";
        readonly 700: "156 17 34";
        readonly 800: "124 13 27";
        readonly 900: "99 11 22";
        readonly 950: "68 6 14";
    };
    readonly gray: {
        readonly 25: "250 250 250";
        readonly 50: "245 245 245";
        readonly 75: "240 240 240";
        readonly 100: "235 235 235";
        readonly 150: "224 224 224";
        readonly 200: "214 214 214";
        readonly 250: "204 204 204";
        readonly 300: "194 194 194";
        readonly 350: "184 184 184";
        readonly 400: "163 163 163";
        readonly 500: "143 143 143";
        readonly 600: "122 122 122";
        readonly 700: "102 102 102";
        readonly 800: "82 82 82";
        readonly 900: "61 61 61";
        readonly 950: "20 20 20";
        readonly 975: "10 10 10";
    };
};
type Primitives = typeof primitives;

export { type Primitives, primitives };
