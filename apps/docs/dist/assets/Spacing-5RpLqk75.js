import{u as i,j as e}from"./index-C2o_YddS.js";import{e as r}from"./SparcFoundation-BXC3zzty.js";function o(s){const n={a:"a",code:"code",h2:"h2",p:"p",strong:"strong",...i(),...s.components},{PageHeader:t}=n;return t||a("PageHeader"),e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Spacing",description:"Spacing conventions observed in the SPARC apps during the 2026-07-21 foundation collection."}),`
`,e.jsxs("div",{className:"my-6 rounded-lg border border-default bg-muted/40 p-4 text-sm text-default",children:[e.jsx("p",{className:"font-semibold text-subtle",children:"Provenance"}),e.jsx("p",{className:"mt-1 text-subtle",children:e.jsx(n.p,{children:`These tokens were collected from the SPARC apps (carltonLaborPlanning +
commonforge-sparc-ui) on 2026-07-21 and are this repo's token source.`})})]}),`
`,e.jsx(n.h2,{id:"spacing-scale",children:"Spacing scale"}),`
`,e.jsx(n.p,{children:`SPARC defines no custom spacing tokens — both apps use Tailwind's default
4px-based scale. This is that scale:`}),`
`,e.jsx(r,{}),`
`,e.jsx(n.h2,{id:"the-rem-sizing-model",children:"The rem sizing model"}),`
`,e.jsxs(n.p,{children:[`Component dimensions (panel heights, input heights, icon sizes) are authored in
rem against the fixed `,e.jsx(n.strong,{children:'16px root font-size — "THE ONE KNOB"'}),` — so the whole UI
scales proportionally from that single value. See
`,e.jsx(n.a,{href:"/foundations/typography",children:"Typography"}),` for the type tokens
that share this model.`]}),`
`,e.jsx(n.h2,{id:"fixed-component-dimensions",children:"Fixed component dimensions"}),`
`,e.jsxs(n.p,{children:["Fixed dimensions (e.g. panel heights, sidebar width ",e.jsx(n.code,{children:"15rem"}),`) are not tokens —
they are documented per-component in the collection's component inventories. If
the design system wants a spacing scale later, that is a new decision, not an
extraction.`]}),`
`,e.jsx(n.h2,{id:"source-of-truth",children:"Source of truth"}),`
`,e.jsxs(n.p,{children:[`Findings summarized from the external collection
(`,e.jsx(n.code,{children:"design-system-testing-abdillah/foundation/foundation.md"}),` §5 and
`,e.jsx(n.code,{children:"tokens.json"})," → ",e.jsx(n.code,{children:"spacing.note"}),"). The JSON states ",e.jsx(n.code,{children:'"custom": false'}),` — there is no
spacing data to render on this page; the scale above is Tailwind's documented
default, shown for reference.`]})]})}function l(s={}){const{wrapper:n}={...i(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(o,{...s})}):o(s)}function a(s,n){throw new Error("Expected component `"+s+"` to be defined: you likely forgot to import, pass, or provide it.")}export{l as default};
