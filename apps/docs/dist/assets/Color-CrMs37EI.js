import{u as i,j as e}from"./index-k1lh-pZG.js";import{S as s,a as t}from"./SparcFoundation-VpEL_00e.js";function o(n){const r={code:"code",em:"em",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...i(),...n.components},{PageHeader:d}=r;return d||c("PageHeader"),e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Color",description:"Color tokens collected from the SPARC apps (carltonLaborPlanning globals.css, verified identical to commonforge-sparc-ui plus the cool-gray ramp). Collected 2026-07-21."}),`
`,e.jsxs("div",{className:"my-6 rounded-lg border border-default bg-muted/40 p-4 text-sm text-default",children:[e.jsx("p",{className:"font-semibold text-subtle",children:"Provenance"}),e.jsx("p",{className:"mt-1 text-subtle",children:e.jsxs(r.p,{children:[`These tokens were collected from the SPARC apps (carltonLaborPlanning +
commonforge-sparc-ui) on 2026-07-21 and are this repo's token source. Values
are rendered straight from `,e.jsx("code",{children:"src/data/sparc-foundation.json"}),` via
inline styles.`]})})]}),`
`,e.jsx(r.h2,{id:"palette-ramps",children:"Palette ramps"}),`
`,e.jsxs(r.p,{children:["Six ramps extracted value-for-value from the running apps. ",e.jsx(r.code,{children:"neutral"}),` is the warm
brand ramp (cream/charcoal), `,e.jsx(r.code,{children:"crimson"})," is the brand/action ramp (500 ",e.jsx(r.code,{children:"#C0180C"}),` =
primary buttons), and `,e.jsx(r.code,{children:"red"}),` is deliberately distinct from crimson for error states.
The cool `,e.jsx(r.code,{children:"gray"}),` ramp comes from Figma Primitives (18 shades incl. the 75/150/250/350/975
half-steps) — only the 3001 app had it tokenized.`]}),`
`,e.jsx(r.h3,{id:"neutral-warm",children:"Neutral (warm)"}),`
`,e.jsx(s,{ramp:"neutral"}),`
`,e.jsx(r.h3,{id:"crimson-brand",children:"Crimson (brand)"}),`
`,e.jsx(s,{ramp:"crimson"}),`
`,e.jsx(r.h3,{id:"green-success",children:"Green (success)"}),`
`,e.jsx(s,{ramp:"green"}),`
`,e.jsx(r.h3,{id:"amber-warning",children:"Amber (warning)"}),`
`,e.jsx(s,{ramp:"amber"}),`
`,e.jsx(r.h3,{id:"red-error",children:"Red (error)"}),`
`,e.jsx(s,{ramp:"red"}),`
`,e.jsx(r.h3,{id:"gray-cool",children:"Gray (cool)"}),`
`,e.jsx(s,{ramp:"gray"}),`
`,e.jsx(r.h2,{id:"semantic-colors",children:"Semantic colors"}),`
`,e.jsx(t,{}),`
`,e.jsx(r.p,{children:"Notes from the collection doc:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"secondary"})," is a ",e.jsx(r.strong,{children:"cool gray inside a warm system"})," — intentional, matches Figma."]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"border-hairline"})," exists, but most components actually use ",e.jsx(r.code,{children:"border-black/10"}),` at
0.5px instead of the hairline token.`]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"muted-foreground"})," / ",e.jsx(r.code,{children:"subtle-foreground"})," are rarely used in components so far."]}),`
`]}),`
`,e.jsx(r.h2,{id:"decisions-applied-2026-07-21",children:"Decisions applied 2026-07-21"}),`
`,e.jsxs(r.ol,{children:[`
`,e.jsxs(r.li,{children:[e.jsxs(r.strong,{children:[e.jsx(r.code,{children:"--primary: #000000"})," → renamed to ",e.jsx(r.code,{children:"--text-primary"})]}),` — it is a text color.
The black was always the primary `,e.jsx(r.em,{children:"text"})," color (~70 usages of the ",e.jsx(r.code,{children:"text-primary"}),`
class), not the action color. Actions are crimson-500. The `,e.jsx(r.code,{children:"--color-primary"}),`
theme mapping now points at `,e.jsx(r.code,{children:"--text-primary"}),", so existing ",e.jsx(r.code,{children:"text-primary"}),`
classes keep working.`]}),`
`,e.jsxs(r.li,{children:[e.jsxs(r.strong,{children:[e.jsx(r.code,{children:"--danger-foreground: #9C1122"})," → removed"]}),`, replaced with
`,e.jsx(r.code,{children:"rgba(255, 255, 255, 0.95)"}),` (near-white alpha). The token is currently unused
in app code, so this is a safe default for future danger buttons.`]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"primary-hover"})," (",e.jsx(r.code,{children:"#98150B"}),", crimson-600) was ",e.jsx(r.strong,{children:"kept"}),` — it is the text hover
state (`,e.jsx(r.code,{children:"hover:text-primary-hover"})," in JobCard/JobCardV2)."]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"primary-foreground"})," (",e.jsx(r.code,{children:"#FFFFFF"}),") was ",e.jsx(r.strong,{children:"kept"}),` — text on dark/primary surfaces
(used by dashboard widgets).`]}),`
`]}),`
`,e.jsx(r.h2,{id:"hardcoded-colors-left-out-of-this-round",children:"Hardcoded colors left out of this round"}),`
`,e.jsxs(r.p,{children:["Per the 2026-07-21 review, promoting these to tokens was ",e.jsx(r.strong,{children:"declined for now"}),` —
they stay hardcoded in component code and are documented here instead:`]}),`
`,e.jsxs(r.table,{children:[e.jsx(r.thead,{children:e.jsxs(r.tr,{children:[e.jsx(r.th,{children:"Hex"}),e.jsx(r.th,{children:"Used for"})]})}),e.jsxs(r.tbody,{children:[e.jsxs(r.tr,{children:[e.jsx(r.td,{children:e.jsx(r.code,{children:"#4169D6"})}),e.jsx(r.td,{children:'job status "In-progress", chart series'})]}),e.jsxs(r.tr,{children:[e.jsx(r.td,{children:e.jsx(r.code,{children:"#DB4C86"})}),e.jsx(r.td,{children:'job status "Potential"'})]}),e.jsxs(r.tr,{children:[e.jsx(r.td,{children:e.jsx(r.code,{children:"#0072E4"})}),e.jsx(r.td,{children:"Actuals bars, skills level 5"})]}),e.jsxs(r.tr,{children:[e.jsx(r.td,{children:e.jsx(r.code,{children:"#00A97F"})}),e.jsx(r.td,{children:'Calendar bars, budget "on track"'})]}),e.jsxs(r.tr,{children:[e.jsx(r.td,{children:e.jsx(r.code,{children:"#0D76F2"})}),e.jsx(r.td,{children:"map pins (staffed)"})]}),e.jsxs(r.tr,{children:[e.jsx(r.td,{children:e.jsx(r.code,{children:"#EB6214"})}),e.jsx(r.td,{children:"skills level 2"})]}),e.jsxs(r.tr,{children:[e.jsxs(r.td,{children:[e.jsx(r.code,{children:"#BC97F7"})," / ",e.jsx(r.code,{children:"#F7F1FF"})," / ",e.jsx(r.code,{children:"#7635D9"})]}),e.jsxs(r.td,{children:["badge ",e.jsx(r.code,{children:"purple"})," variant"]})]}),e.jsxs(r.tr,{children:[e.jsx(r.td,{children:e.jsx(r.code,{children:"#2D251F"})}),e.jsx(r.td,{children:"progress-bar default fill"})]}),e.jsxs(r.tr,{children:[e.jsxs(r.td,{children:[e.jsx(r.code,{children:"#A2A19A"})," / ",e.jsx(r.code,{children:"#D3D2CF"})]}),e.jsx(r.td,{children:"gantt bar default/disabled"})]}),e.jsxs(r.tr,{children:[e.jsx(r.td,{children:e.jsx(r.code,{children:"#211D1A"})}),e.jsx(r.td,{children:"chart tooltip background"})]})]})]}),`
`,e.jsx(r.h2,{id:"source-of-truth",children:"Source of truth"}),`
`,e.jsxs(r.p,{children:["Values on this page come from ",e.jsx(r.code,{children:"apps/docs/src/data/sparc-foundation.json"}),`, copied
unchanged from the original collection (`,e.jsx(r.code,{children:"design-system-testing-abdillah/foundation/tokens.json"}),`,
v0.2.0). See that repo's `,e.jsx(r.code,{children:"foundation.md"}),` for the full decision log. This
collection is this repo's token source.`]})]})}function h(n={}){const{wrapper:r}={...i(),...n.components};return r?e.jsx(r,{...n,children:e.jsx(o,{...n})}):o(n)}function c(n,r){throw new Error("Expected component `"+n+"` to be defined: you likely forgot to import, pass, or provide it.")}export{h as default};
