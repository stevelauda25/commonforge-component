import{u as i,j as e}from"./index-k1lh-pZG.js";import{b as r,c,d}from"./SparcFoundation-VpEL_00e.js";function t(s){const n={code:"code",h2:"h2",p:"p",strong:"strong",...i(),...s.components},{PageHeader:o}=n;return o||a("PageHeader"),e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Typography",description:"Typography tokens collected from the SPARC apps (carltonLaborPlanning globals.css, verified identical to commonforge-sparc-ui). Collected 2026-07-21."}),`
`,e.jsxs("div",{className:"my-6 rounded-lg border border-default bg-muted/40 p-4 text-sm text-default",children:[e.jsx("p",{className:"font-semibold text-subtle",children:"Provenance"}),e.jsx("p",{className:"mt-1 text-subtle",children:e.jsxs(n.p,{children:[`These tokens were collected from the SPARC apps (carltonLaborPlanning +
commonforge-sparc-ui) on 2026-07-21 and are this repo's token source. Values
are rendered straight from `,e.jsx("code",{children:"src/data/sparc-foundation.json"}),` via
inline styles.`]})})]}),`
`,e.jsx(n.h2,{id:"font-family",children:"Font family"}),`
`,e.jsxs(n.p,{children:["SPARC uses ",e.jsx(n.strong,{children:"Geist"})," with Inter and system fallbacks."]}),`
`,e.jsx(r,{}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"No mono token is shipped by decision"}),` (2026-07-21): neither Geist Mono nor
Space Mono. Mono usages (code snippets, job numbers, JSON logs) fall back to the
platform monospace stack via Tailwind's default `,e.jsx(n.code,{children:"font-mono"}),", which needs no token."]}),`
`,e.jsx(n.h2,{id:"size-scale",children:"Size scale"}),`
`,e.jsxs(n.p,{children:["Seven sizes in the collected scale (",e.jsx(n.code,{children:"text-3xs"})," → ",e.jsx(n.code,{children:"text-body-lg"}),`), of which three
— `,e.jsx(n.code,{children:"text-xs"}),", ",e.jsx(n.code,{children:"text-body"}),", ",e.jsx(n.code,{children:"text-body-lg"}),` — equal Tailwind stock values and are
marked as stock context rows. The collected line-heights `,e.jsx(n.strong,{children:"override"}),` Tailwind's
stock `,e.jsx(n.code,{children:"leading-tight"})," / ",e.jsx(n.code,{children:"leading-snug"}),"."]}),`
`,e.jsx(c,{}),`
`,e.jsx(n.h2,{id:"weights",children:"Weights"}),`
`,e.jsx(d,{}),`
`,e.jsxs(n.p,{children:[`These are Tailwind stock classes as used across the SPARC components
(`,e.jsx(n.code,{children:"font-medium"})," 500 is the workhorse); they are documented here, not yet tokens."]}),`
`,e.jsx(n.h2,{id:"root-font-size--the-one-knob",children:'Root font-size — "THE ONE KNOB"'}),`
`,e.jsxs(n.p,{children:["Root font-size is fixed at ",e.jsx(n.strong,{children:"16px"}),`. All component sizing is authored in rem
against it, so the whole UI scales from that single value.`]}),`
`,e.jsx(n.h2,{id:"source-of-truth",children:"Source of truth"}),`
`,e.jsxs(n.p,{children:["Values on this page come from ",e.jsx(n.code,{children:"apps/docs/src/data/sparc-foundation.json"}),`, copied
unchanged from the original collection (`,e.jsx(n.code,{children:"design-system-testing-abdillah/foundation/tokens.json"}),`,
v0.3.1). This collection is this repo's token source.`]})]})}function x(s={}){const{wrapper:n}={...i(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(t,{...s})}):t(s)}function a(s,n){throw new Error("Expected component `"+s+"` to be defined: you likely forgot to import, pass, or provide it.")}export{x as default};
