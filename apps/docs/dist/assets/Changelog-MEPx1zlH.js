import{u as r,j as n}from"./index-C2o_YddS.js";function s(o){const e={blockquote:"blockquote",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",ul:"ul",...r(),...o.components},{PageHeader:t}=e;return t||i("PageHeader"),n.jsxs(n.Fragment,{children:[n.jsx(t,{title:"Changelog",description:"Notable changes to this design system. `pod-test-ui` and `pod-test-tokens` are local workspace packages and ship in lockstep."}),`
`,n.jsx(e.h2,{id:"2026-07-21--sparc-token--atom-collection",children:"2026-07-21 — SPARC token + atom collection"}),`
`,n.jsx(e.h3,{id:"foundations",children:"Foundations"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Color, typography, spacing, radius, and elevation tokens collected from the SPARC apps (carltonLaborPlanning + commonforge-sparc-ui). This collection is this repo's token source; see the Foundations pages for the full scales and decision log."}),`
`]}),`
`,n.jsx(e.h3,{id:"components",children:"Components"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"15 atoms documented from the SPARC apps: Button, Badge, Checkbox, Switch, Tag, Input, Text Area, Radio, Segmented Button, Slider, Loading Spinner, Avatar, Separator, List Base, Tooltip."}),`
`]}),`
`,n.jsx(e.hr,{}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsx(e.p,{children:"Earlier POD-era release entries (v0.1.0 – v0.1.12) were removed: they cover components and release infrastructure that do not exist on this branch."}),`
`]})]})}function c(o={}){const{wrapper:e}={...r(),...o.components};return e?n.jsx(e,{...o,children:n.jsx(s,{...o})}):s(o)}function i(o,e){throw new Error("Expected component `"+o+"` to be defined: you likely forgot to import, pass, or provide it.")}export{c as default};
