
import { Smartphone, Tablet, Monitor, Frame } from "lucide-react";

export const DEFAULT_TOKENS = // =============================================================
{
  colors: {
    "brand": "#171717",
    "brand-hover": "#404040",
    "accent": "#2563eb",
    "accent-hover": "#1d4ed8",
    "surface": "#ffffff",
    "surface-muted": "#f5f5f5",
    "surface-hover": "#e5e5e5",
    "text": "#171717",
    "text-muted": "#737373",
    "text-inverse": "#ffffff",
    "border": "#e5e5e5",
    "danger": "#dc2626",
    "danger-hover": "#b91c1c",
  },
  spacing: {
    "btn-x-sm": "12px",
    "btn-y-sm": "6px",
    "btn-x-md": "16px",
    "btn-y-md": "8px",
    "btn-x-lg": "20px",
    "btn-y-lg": "10px",
  },
  radius: {
    "btn": "8px",
    "card": "12px",
  },
  fontSize: {
    "btn-sm": "12px",
    "btn-md": "14px",
    "btn-lg": "16px",
  },
};

export const FRAME_PRESETS = 
{
  auto: { name: "Auto", width: null, height: null, icon: Frame },
  mobile: { name: "Mobile", width: 375, height: 400, icon: Smartphone },
  tablet: { name: "Tablet", width: 768, height: 500, icon: Tablet },
  desktop: { name: "Desktop", width: 1280, height: 720, icon: Monitor },
  custom: { name: "Custom", width: null, height: null, icon: Frame },
};

export const BLANK_CODE = // =============================================================
`// ============================================================
// BLANK COMPONENT — Start building your own
// ============================================================
//
// WHAT TO WRITE HERE:
// A React function component. Anything that works in React works here.
// The only rule: use h() instead of JSX (no build step needed).
//
// ANATOMY OF A COMPONENT:
//
//   function ComponentName({ prop1 = "default", prop2 = false }) {
//     // 1. Hooks (optional) — for interactivity & state
//     const [value, setValue] = useState(0);
//
//     // 2. Logic (optional) — calculations, derived values
//     const doubled = value * 2;
//
//     // 3. Return UI using h(tag, props, ...children)
//     return h('div', { style: {...} }, 'Hello');
//   }
//
// THE h() FUNCTION:
//   h('tag', props, ...children)
//   - tag    : string like 'div', 'button', 'span'
//   - props  : object { onClick, style, className, ... } or null
//   - children: strings, numbers, or more h() calls
//
// AVAILABLE IN SCOPE:
//   h              — create element
//   useState       — component state
//   useEffect      — side effects
//   useRef         — DOM refs
//   useCallback    — memoized callbacks
//   useMemo        — memoized values
//   Fragment       — group elements without wrapper
//
// PROPS WITH DEFAULTS BECOME EDITABLE:
// Props you define with = defaults show up in the Props tab automatically.
// Strings, numbers, booleans become proper input controls.
// If you define an "xStyles" object (like variantStyles), props with
// matching key get an enum dropdown (e.g. variant = "primary").
//
// DESIGN TOKENS:
// Reference global tokens with CSS variables:
//   var(--token-colors-brand)
//   var(--token-spacing-btn-x-md)
//   var(--token-radius-btn)
//   var(--token-fontSize-btn-md)
// Override them per-component in the Tokens tab.
// ============================================================

function Component() {
  // Example: a simple card. Replace this with anything you want.
  return h('div', {
    style: {
      padding: "var(--token-spacing-btn-y-md) var(--token-spacing-btn-x-md)",
      background: "var(--token-colors-surface-muted)",
      border: "1px solid var(--token-colors-border)",
      borderRadius: "var(--token-radius-btn)",
      fontSize: "var(--token-fontSize-btn-md)",
      color: "var(--token-colors-text)",
    }
  }, "Start building here — edit this code");
}
`;

export const KNOB_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Knob with Dynamic Ticks</title>

  <!-- Google Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-color: #3E3E43;
      --color-start: #04A8AB;
      --color-end: #75FF53;
    }

    * {
      box-sizing: border-box;
      font-family: 'Chakra Petch', sans-serif;
    }

    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: var(--bg-color);
    }

    .knob-container {
      position: relative;
      width: 250px;
      height: 250px;
      border-radius: 50%;
      background: linear-gradient(180deg, #29282A 0%, #3D3D40 100%);
      box-shadow: 0 0.5px 1px rgba(255, 255, 255, 0.2),
                  -5px -5px 16px rgba(244, 244, 244, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dark-area {
      width: 190px;
      height: 190px;
      background: linear-gradient(180deg, #141315 0%, #1D1C1E 100%);
      border-radius: 50%;
      box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.5),
                  0 1px 2px rgba(255, 255, 255, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .bg-knob {
      width: 175px;
      height: 175px;
      background: linear-gradient(-90deg, #2C2E2E 0%, #404045 100%);
      border-radius: 50%;
      display: flex;
      box-shadow: 0 -2px 2px rgba(255, 255, 255, 0.3),
                  0 16px 32px rgba(0, 0, 0, 0.5);
      justify-content: center;
      align-items: center;
    }

    .knob {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: grab;
    }

    .bg-indicator {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: linear-gradient(180deg, #29282A 0%, #3D3D40 100%);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .knob-indicator {
      width: 4px;
      height: 20px;
      background-color: #ffffff;
      position: absolute;
      top: 4.2rem;
      border-radius: 320px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0 0px 12px rgba(255, 255, 255, 0.5),
                  inset 0 1.2px 3px rgba(0, 0, 0, 0.3);
    }

    .ticks {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .tick {
      position: absolute;
      width: 2.5px;
      height: 5px;
      background-color: rgba(26, 25, 27, 0.5);
      border-radius: 2px;
      top: 10.5px;
      left: 50%;
      transform-origin: 0% 114px;
      transform: translateX(-50%);
      box-shadow: inset 0 1.2px 3px rgba(0, 0, 0, 0.3);
      transition: opacity 0.3s ease-in-out, background-color 0.4s ease;
    }

    .tick.large {
      height: 10px;
    }

    .tick.active {
      opacity: 1;
    }
  </style>
</head>

<body>

  <div class="knob-container">
    <div class="knob" id="knob">
      <div class="dark-area">
        <div class="bg-knob">
          <div class="bg-indicator">
            <div class="knob-indicator"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="ticks" id="ticks"></div>
  </div>

  <script>
    const knob = document.getElementById('knob');
    const ticksContainer = document.getElementById('ticks');
    let isDragging = false;
    let currentRotation = 0;
    let startAngle = 0;

    const minAngle = -120;
    const maxAngle = 120;
    const totalTicks = 51;
    let tickElements = [];

    function getCoordinates(event) {
      if (event.touches) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY };
      } else {
        return { x: event.clientX, y: event.clientY };
      }
    }

    function calculateAngle(event) {
      const rect = knob.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const { x, y } = getCoordinates(event);
      const radians = Math.atan2(y - centerY, x - centerX);
      return radians * (180 / Math.PI);
    }

    function interpolateColor(color1, color2, factor) {
      const result = color1.slice();
      for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
      }
      return "rgb(" + result[0] + ", " + result[1] + ", " + result[2] + ")";
    }

    function hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function getCSSVar(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    const colorStart = hexToRgb(getCSSVar('--color-start') || "#04A8AB");
    const colorEnd = hexToRgb(getCSSVar('--color-end') || "#75FF53");

    function calculateColor(angle) {
      const factor = (angle + 120) / 240;
      return interpolateColor(colorStart, colorEnd, factor);
    }

    function generateTicks() {
      const angleStep = (maxAngle - minAngle) / (totalTicks - 1);

      for (let i = 0; i < totalTicks; i++) {
        const tick = document.createElement('div');
        tick.classList.add('tick');

        if (i % 5 === 0 || i === 0 || i === totalTicks - 1) {
          tick.classList.add('large');
        }

        const tickAngle = minAngle + (i * angleStep);
        tick.style.transform = "rotate(" + tickAngle + "deg) translateX(-50%)";
        ticksContainer.appendChild(tick);
        tickElements.push({ element: tick, angle: tickAngle });
      }

      updateActiveTicks(currentRotation);
    }

    function setKnobRotation(angle) {
      knob.style.transform = "rotate(" + angle + "deg)";
    }

    function updateActiveTicks(rotation) {
      tickElements.forEach(({ element, angle }) => {
        if (rotation >= angle) {
          const activeColor = calculateColor(angle);
          element.classList.add('active');
          element.style.backgroundColor = activeColor;
          element.style.boxShadow =
            "0 0px 4px " + activeColor + ", inset 0 1.2px 3px rgba(0,0,0,0.3)";
        } else {
          element.classList.remove('active');
          element.style.backgroundColor = '';
          element.style.boxShadow = '';
        }
      });
    }

    function startDragging(event) {
      isDragging = true;
      startAngle = calculateAngle(event);
      document.body.style.cursor = 'grabbing';
    }

    function stopDragging() {
      isDragging = false;
      document.body.style.cursor = 'default';
    }

    function handleDragging(event) {
      if (!isDragging) return;

      const angle = calculateAngle(event);
      let rotationDelta = angle - startAngle;

      if (rotationDelta > 180) rotationDelta -= 360;
      if (rotationDelta < -180) rotationDelta += 360;

      let newRotation = currentRotation + rotationDelta;
      newRotation = Math.max(minAngle, Math.min(maxAngle, newRotation));

      setKnobRotation(newRotation);
      updateActiveTicks(newRotation);

      currentRotation = newRotation;
      startAngle = angle;
    }

    knob.addEventListener('mousedown', startDragging);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('mousemove', handleDragging);

    knob.addEventListener('touchstart', startDragging);
    document.addEventListener('touchend', stopDragging);
    document.addEventListener('touchmove', handleDragging);

    generateTicks();
  </script>

</body>
</html>`;

export const SLIDER_CODE = 
`// ============================================================
// SLIDER — Range input with live value display
// ============================================================
// Demonstrates:
//   • Interactive state with useState — drag the handle to update value
//   • Number props (min, max, step, defaultValue) as number inputs
//   • Enum prop (color) auto-detected from colorStyles object
//   • Dynamic style based on state (fill bar width follows value)
//   • Inline <style> tag to style native input pseudo-elements
//
// PROPS (edit in Props tab):
//   label         : string
//   min / max     : number — range bounds
//   step          : number — increment size
//   defaultValue  : number — initial slider position
//   showValue     : boolean — show current value on the right
//   color         : "accent" | "brand" | "danger" (enum)
// ============================================================

function Slider({
  label = "Volume",
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  showValue = true,
  color = "accent"
}) {
  // Live state — drag the slider, value updates in real time
  const [value, setValue] = useState(defaultValue);

  // Defining "colorStyles" makes \`color\` an enum in Props panel
  const colorStyles = {
    accent: "var(--token-colors-accent)",
    brand: "var(--token-colors-brand)",
    danger: "var(--token-colors-danger)",
  };

  const fillColor = colorStyles[color] || colorStyles.accent;
  // Derived value: percentage for the fill bar width
  const percent = ((value - min) / (max - min)) * 100;

  return h('div', {
    style: {
      width: "280px",
      fontFamily: "inherit",
    }
  },
    // Label row: title on left, live value on right
    h('div', {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
      }
    },
      h('label', {
        style: {
          fontSize: "var(--token-fontSize-btn-sm)",
          fontWeight: 500,
          color: "var(--token-colors-text)",
        }
      }, label),
      showValue && h('span', {
        style: {
          fontSize: "var(--token-fontSize-btn-sm)",
          fontWeight: 600,
          color: fillColor,
          fontVariantNumeric: "tabular-nums",
        }
      }, value)
    ),
    // Track + fill + native input (stacked with absolute positioning)
    h('div', {
      style: {
        position: "relative",
        height: "20px",
        display: "flex",
        alignItems: "center",
      }
    },
      // Background track (static gray bar)
      h('div', {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          height: "4px",
          background: "var(--token-colors-surface-hover)",
          borderRadius: "var(--token-radius-btn)",
        }
      }),
      // Fill bar (width driven by current value)
      h('div', {
        style: {
          position: "absolute",
          left: 0,
          width: percent + "%",
          height: "4px",
          background: fillColor,
          borderRadius: "var(--token-radius-btn)",
          transition: "width 80ms",
        }
      }),
      // Native range input (invisible but catches drag events)
      h('input', {
        type: "range",
        min: min,
        max: max,
        step: step,
        value: value,
        onChange: (e) => setValue(Number(e.target.value)),
        style: {
          position: "relative",
          width: "100%",
          height: "20px",
          margin: 0,
          background: "transparent",
          appearance: "none",
          WebkitAppearance: "none",
          cursor: "pointer",
          outline: "none",
        }
      })
    ),
    // Inline style to customize the drag handle (pseudo-element)
    h('style', null, 
      'input[type="range"]::-webkit-slider-thumb {' +
        'appearance: none;' +
        '-webkit-appearance: none;' +
        'width: 16px;' +
        'height: 16px;' +
        'border-radius: 50%;' +
        'background: white;' +
        'border: 2px solid ' + fillColor + ';' +
        'cursor: pointer;' +
        'box-shadow: 0 1px 4px rgba(0,0,0,0.15);' +
      '}' +
      'input[type="range"]::-moz-range-thumb {' +
        'width: 16px;' +
        'height: 16px;' +
        'border-radius: 50%;' +
        'background: white;' +
        'border: 2px solid ' + fillColor + ';' +
        'cursor: pointer;' +
        'box-shadow: 0 1px 4px rgba(0,0,0,0.15);' +
      '}'
    )
  );
}
`;

export const TEMPLATES = 
{
  html: {
    name: "Raw HTML",
    code: `<!-- Paste your Raw HTML below -->
<div style="padding: 24px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1;">
  <h2 style="color: #0f172a; margin: 0 0 8px 0; font-family: sans-serif;">Raw HTML Canvas</h2>
  <p style="color: #475569; margin: 0; font-family: sans-serif;">
    You can paste any standard HTML code here.
    It will be rendered exactly as written.
  </p>
</div>`
  },
  blank: {
    name: "Blank",
    description: "Start from scratch",
    icon: "◌",
    code: BLANK_CODE,
    componentName: "Component",
  },
  button: {
    name: "Button",
    description: "Interactive button with variants",
    icon: "▢",
    code: null, // filled in below — uses DEMO_CODE
    componentName: "Button",
  },
  knob: {
    name: "Knob",
    description: "Interactive rotation knob",
    icon: "◎",
    code: KNOB_CODE,
    defaultSize: { width: 400, widthMode: "fixed", height: 380, heightMode: "fixed" }
  },
  slider: {
    name: "Slider",
    description: "Range input with live value",
    icon: "━",
    code: SLIDER_CODE,
    componentName: "Slider",
  },
  switch: {
    name: "Switch",
    description: "Futuristic toggle switch",
    icon: "◍",
    defaultSize: { width: 400, widthMode: "fixed", height: 200, heightMode: "fixed" },
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Switch Toggle</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Google Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-color: #3E3E43;
      --accent-color: #F5F552;
      --off-color: #B3B3B3;
    }

    * {
      box-sizing: border-box;
      font-family: 'Chakra Petch', sans-serif;
    }

    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: var(--bg-color);
      transition: background-color 0.3s ease;
    }

    .switch-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bg-switch {
      padding: 8px;
      background: linear-gradient(180deg, #272628 0%, #3D3D40 100%);
      border-radius: 300px;
      box-shadow: 0 0.5px 1px rgba(255, 255, 255, 0.2), -5px -5px 16px rgba(244, 244, 244, 0.1);
    }

    .switch {
      width: 150px;
      height: 55px;
      border-radius: 30px;
      background: linear-gradient(180deg, #141315 0%, #262527 100%);
      position: relative;
      display: flex;
      align-items: center;
      padding: 5px;
      box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.3), 0 0.5px 1px rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }

    .switch-label {
      font-size: 17px;
      font-weight: bold;
      color: var(--off-color);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      opacity: 0;
      transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .switch-label.on {
      left: 28px;
      color: var(--accent-color);
    }

    .switch-label.off {
      right: 24px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.2);
    }

    .switch.on .switch-label.on {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }

    .switch.on .switch-label.off {
      opacity: 0;
      transform: translateY(-50%) scale(0.8);
    }

    .switch.off .switch-label.on {
      opacity: 0;
      transform: translateY(-50%) scale(0.8);
    }

    .switch.off .switch-label.off {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }

    .knob {
      width: 80px;
      height: 60px;
      background: linear-gradient(180deg, #2C2E2E 0%, #424147 100%);
      border-radius: 50px;
      position: absolute;
      left: -2px;
      top: 50%;
      transform: translateY(-50%);
      box-shadow: inset 0px 0.6px 1.2px rgba(255, 255, 255, 0.3), 2px 8px 24px rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;
      transition: all 0.3s ease;
    }

    .knob-pattern {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 45%;
      height: 30%;
    }

    .line {
      background-color: rgba(42, 42, 42, 0.6);
      border-radius: 3px;
      box-shadow: inset 0 1.2px 3px rgba(0, 0, 0, 0.3), 0 0.5px 1px rgba(255, 255, 255, 0.2);
    }

    .line.short {
      width: 6px;
      height: 12px;
    }

    .line.medium {
      width: 6px;
      height: 16px;
    }

    @keyframes light-up {
      0% {
        background-color: rgba(42, 42, 42, 0.6);
        box-shadow: inset 0 1.2px 3px rgba(0, 0, 0, 0.3), 0 0.5px 1px rgba(255, 255, 255, 0.2);
      }
      100% {
        background-color: var(--accent-color);
        box-shadow: 0 0 16px var(--accent-color),
                    inset 0 1.2px 3px rgba(0, 0, 0, 0.3),
                    0 0.5px 1px rgba(255, 255, 255, 0.2);
      }
    }

    .switch.on .knob {
      left: 72px;
    }

    .switch.on .line.short:nth-child(1) {
      animation: light-up 0.3s 0.1s forwards;
    }

    .switch.on .line.medium:nth-child(2) {
      animation: light-up 0.3s 0.2s forwards;
    }

    .switch.on .line.short:nth-child(3) {
      animation: light-up 0.3s 0.3s forwards;
    }
  </style>
</head>

<body>

  <div class="switch-container">
    <div class="bg-switch">
      <div class="switch off">
        <div class="knob">
          <div class="knob-pattern">
            <div class="line short"></div>
            <div class="line medium"></div>
            <div class="line short"></div>
          </div>
        </div>
        <span class="switch-label on">{{ label_on: "ON" }}</span>
        <span class="switch-label off">{{ label_off: "OFF" }}</span>
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const switchElement = document.querySelector('.switch');
      const lines = document.querySelectorAll('.line');
      let isOn = false;

      function setInitialState() {
        lines.forEach(line => {
          line.style.backgroundColor = 'rgba(42, 42, 42, 0.6)';
        });
        switchElement.classList.add('off');
        switchElement.classList.remove('on');
      }

      switchElement.addEventListener('click', function() {
        isOn = !isOn;
        updateSwitchState();
      });

      function updateSwitchState() {
        if (isOn) {
          switchElement.classList.add('on');
          switchElement.classList.remove('off');
        } else {
          switchElement.classList.remove('on');
          switchElement.classList.add('off');
        }
      }

      setInitialState();
    });
  </script>

</body>
</html>`,
    componentName: "Switch",
    defaultSize: { width: 400, widthMode: "fixed", height: 200, heightMode: "fixed" },
  },
};

export const DEMO_CODE = `// ============================================================
// BUTTON — Interactive button with variants, sizes, and states
// ============================================================
// Demonstrates the full playground capability:
//   • 5 variants (primary, secondary, accent, danger, ghost)
//   • 3 sizes (sm, md, lg)
//   • Hover state (color change)
//   • Press state (scale-down animation)
//   • Disabled state (opacity + cursor)
//   • All token categories: colors, spacing, radius, fontSize
//
// HOW VARIANT & SIZE BECOME ENUM DROPDOWNS:
// Because variantStyles and sizeStyles are defined as objects with
// named keys, the playground auto-detects them as enums. The Props
// panel shows them as pill buttons instead of text inputs.
//
// PROPS (edit in Props tab):
//   label    : string  — button text
//   variant  : enum    — visual style (primary/secondary/accent/danger/ghost)
//   size     : enum    — padding & font size (sm/md/lg)
//   disabled : boolean — prevents interaction & dims the button
//
// TRY THIS:
//   1. Switch variant in Props tab — hover over the button to see state change
//   2. Open Tokens tab — override "accent" color to a custom brand
//   3. Add a new variant: add \`info: {...}\` to variantStyles, update default
// ============================================================

function Button({
  label = "Click me",
  variant = "primary",
  size = "md",
  disabled = false
}) {
  // Interaction state — hover brightens, press scales down slightly
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Each variant maps to a set of 4 style properties.
  // Adding a new key here creates a new option in the Props panel.
  const variantStyles = {
    primary: {
      bg: "var(--token-colors-brand)",
      bgHover: "var(--token-colors-brand-hover)",
      color: "var(--token-colors-text-inverse)",
      border: "transparent",
    },
    secondary: {
      bg: "var(--token-colors-surface-muted)",
      bgHover: "var(--token-colors-surface-hover)",
      color: "var(--token-colors-text)",
      border: "var(--token-colors-border)",
    },
    accent: {
      bg: "var(--token-colors-accent)",
      bgHover: "var(--token-colors-accent-hover)",
      color: "var(--token-colors-text-inverse)",
      border: "transparent",
    },
    danger: {
      bg: "var(--token-colors-danger)",
      bgHover: "var(--token-colors-danger-hover)",
      color: "var(--token-colors-text-inverse)",
      border: "transparent",
    },
    ghost: {
      bg: "transparent",
      bgHover: "var(--token-colors-surface-muted)",
      color: "var(--token-colors-text)",
      border: "transparent",
    },
  };

  // Size controls padding + font-size, using scoped token names
  const sizeStyles = {
    sm: {
      padding: "var(--token-spacing-btn-y-sm) var(--token-spacing-btn-x-sm)",
      fontSize: "var(--token-fontSize-btn-sm)",
    },
    md: {
      padding: "var(--token-spacing-btn-y-md) var(--token-spacing-btn-x-md)",
      fontSize: "var(--token-fontSize-btn-md)",
    },
    lg: {
      padding: "var(--token-spacing-btn-y-lg) var(--token-spacing-btn-x-lg)",
      fontSize: "var(--token-fontSize-btn-lg)",
    },
  };

  // Defensive fallback — if an unknown variant/size is passed, use default
  const v = variantStyles[variant] || variantStyles.primary;
  const s = sizeStyles[size] || sizeStyles.md;

  return h('button', {
    disabled: disabled,
    // Mouse events drive the interaction states
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPressed(false); },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    style: {
      // Dynamic styling — state determines final appearance
      background: hover && !disabled ? v.bgHover : v.bg,
      color: v.color,
      border: "1px solid " + v.border,
      borderRadius: "var(--token-radius-btn)",
      padding: s.padding,
      fontSize: s.fontSize,
      fontWeight: 500,
      fontFamily: "inherit",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transform: pressed && !disabled ? "scale(0.97)" : "scale(1)",
      transition: "background 120ms, transform 80ms",
      outline: "none",
    }
  }, label);
}
`;

TEMPLATES.button.code = DEMO_CODE;
