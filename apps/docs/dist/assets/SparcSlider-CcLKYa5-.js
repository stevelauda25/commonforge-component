import{r as _,j as e,u as w}from"./index-C2o_YddS.js";import{c as g}from"./text-area-DmxvntcW.js";const f="0 4px 8px -4px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.15), 0 1px 2px -1px rgba(0,0,0,0.2), inset 0 0 0 0.5px rgba(0,0,0,0.1), inset 0 -0.5px 0.5px 0 rgba(0,0,0,0.1), inset 0 0.5px 1px 0 rgba(255,255,255,0.25)",H="shadow-[0_4px_8px_-4px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.15),0_1px_2px_-1px_rgba(0,0,0,0.2),inset_0_0_0_0.5px_rgba(0,0,0,0.1),inset_0_-0.5px_0.5px_0_rgba(0,0,0,0.1),inset_0_0.5px_1px_0_rgba(255,255,255,0.25)]",P=`
.sparc-slider-input {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  background: transparent;
  pointer-events: none;
}
.sparc-slider-input::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  background: transparent;
  border: none;
}
.sparc-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  pointer-events: auto;
  height: 10px;
  width: 10px;
  border-radius: 9999px;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  background: #FAFAFA;
  box-shadow: ${f};
  cursor: pointer;
}
.sparc-slider-input::-moz-range-track {
  background: transparent;
  border: none;
}
.sparc-slider-input::-moz-range-thumb {
  pointer-events: auto;
  height: 10px;
  width: 10px;
  border-radius: 9999px;
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  background: #FAFAFA;
  box-shadow: ${f};
  cursor: pointer;
}
`;function x({variant:r="default",min:t=0,max:o=100,value:a,defaultValue:k=80,valueEnd:u,defaultValueEnd:y=80,showValue:S=!1,onValueChange:l,onRangeChange:p,label:c="Value",className:A}){const[N,E]=_.useState(k),[F,v]=_.useState(y),s=a??N,d=u??F,b=Math.max(1,o-t),D=r==="range"?(s-t)/b*100:0,M=((r==="range"?d:s)-t)/b*100;function m(n){const i=r==="range"?Math.min(n,d):n;a===void 0&&E(i),r==="range"?p==null||p([i,d]):l==null||l(i)}function $(n){const i=Math.max(n,s);u===void 0&&v(i),p==null||p([s,i])}return e.jsxs("div",{className:g("w-[200px]",A),children:[e.jsx("style",{children:P}),e.jsxs("div",{className:"relative h-[10px]",children:[e.jsx("div",{className:"absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full border-[0.5px] border-black/10 bg-black/[0.08]",children:r!=="no-value"&&e.jsx("div",{className:"absolute inset-y-0 bg-[#C0180C]",style:{left:`${D}%`,right:`${100-M}%`}})}),r==="no-value"&&e.jsx("span",{"aria-hidden":"true",className:g("absolute left-0 top-1/2 z-10 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.5px] border-black/20 bg-[#FAFAFA]",H)}),r!=="no-value"&&e.jsx("input",{type:"range",min:t,max:o,value:r==="range"?d:s,onChange:n=>r==="range"?$(Number(n.target.value)):m(Number(n.target.value)),"aria-label":r==="range"?`${c} maximum`:c,className:"sparc-slider-input absolute inset-0 z-10 h-[10px] w-full"}),r==="range"&&e.jsx("input",{type:"range",min:t,max:o,value:s,onChange:n=>m(Number(n.target.value)),"aria-label":`${c} minimum`,className:"sparc-slider-input absolute inset-0 z-20 h-[10px] w-full"})]}),S&&r!=="no-value"&&e.jsx("div",{className:"mt-1 text-[10px] leading-[14px] text-secondary tabular-nums",children:r==="range"?`${s}–${d}`:s})]})}function h(r){const t={h2:"h2",...w(),...r.components},{PageHeader:o,PreviewCard:a}=t;return o||j("PageHeader"),a||j("PreviewCard"),e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Slider",description:"Range input with default, range, and empty modes."}),`
`,e.jsx(t.h2,{id:"default",children:"Default"}),`
`,e.jsx(a,{children:e.jsx(x,{defaultValue:60})}),`
`,e.jsx(t.h2,{id:"range",children:"Range"}),`
`,e.jsx(a,{children:e.jsx(x,{mode:"range",defaultStartValue:20,defaultValue:70})}),`
`,e.jsx(t.h2,{id:"empty",children:"Empty"}),`
`,e.jsx(a,{children:e.jsx(x,{mode:"empty"})})]})}function I(r={}){const{wrapper:t}={...w(),...r.components};return t?e.jsx(t,{...r,children:e.jsx(h,{...r})}):h(r)}function j(r,t){throw new Error("Expected component `"+r+"` to be defined: you likely forgot to import, pass, or provide it.")}export{I as default};
