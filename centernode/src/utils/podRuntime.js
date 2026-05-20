/**
 * POD design system integration for the playground runtime.
 * Components below are AUTO-INJECTED by scripts/canvas/sync.mjs.
 * Any component with a packages/ui/src/<dir>/canvas.ts file shows up here.
 *
 * Manually-maintained: transformIfJSX (sucrase config) and exports below.
 */
import { Badge } from "pod-test-ui/badges";
import { Button } from "pod-test-ui/button";
import { ButtonGroup } from "pod-test-ui/button-group";
import { Checkbox } from "pod-test-ui/checkbox";
import { Dropdown, DropdownMenu, DropdownItem, DropdownBadge } from "pod-test-ui/dropdown";
import { Radio } from "pod-test-ui/radio";
import { SearchInput } from "pod-test-ui/search-input";
import { Switch } from "pod-test-ui/switch";
import { Tab } from "pod-test-ui/tabs";
import { Tag } from "pod-test-ui/tag";
import { TextInput } from "pod-test-ui/text-input";
import { Tooltip } from "pod-test-ui/tooltip";
import { canvasManifest } from "pod-test-ui/canvas";
import { transform } from "sucrase";

export const POD_COMPONENTS = {
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownBadge,
  Radio,
  SearchInput,
  Switch,
  Tab,
  Tag,
  TextInput,
  Tooltip
};
export { canvasManifest };

// JSX heuristics — match a tag opener like `<Button` or `<div className`.
// Cheap pre-filter so we skip sucrase entirely for plain h() code.
const JSX_HINT = /<[A-Z][\w.]*[\s/>]|<[a-z][\w-]*(?:\s+[\w-]+\s*=)/;

export function transformIfJSX(code) {
  if (!JSX_HINT.test(code)) return code;
  try {
    const out = transform(code, {
      transforms: ["jsx", "typescript", "imports"],
      jsxRuntime: "classic",
      jsxPragma: "h",
      jsxFragmentPragma: "Fragment",
      production: true,
    });
    return out.code
      .replace(/^\s*(?:var|const|let)\s+\w+\s*=\s*require\(['"][^'"]+['"]\);?\s*$/gm, "")
      .replace(/^\s*Object\.defineProperty\(exports.*$/gm, "")
      .replace(/^\s*exports\.\w+\s*=.*$/gm, "")
      .replace(/^\s*"use strict";\s*$/gm, "");
  } catch (err) {
    throw new Error(`JSX transform failed: ${err.message}`);
  }
}

// Names + values for `new Function(...)` factory. Order MUST match between
// `paramNames` and `paramValues` when invoking.
export const POD_SCOPE_NAMES = Object.keys(POD_COMPONENTS);
export const POD_SCOPE_VALUES = Object.values(POD_COMPONENTS);
