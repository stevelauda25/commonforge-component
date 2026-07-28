import * as react from 'react';
import { ButtonHTMLAttributes, ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, HTMLAttributes, ReactElement, ComponentType, SVGProps, MouseEventHandler, CSSProperties, ComponentPropsWithoutRef } from 'react';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import { ClassValue } from 'clsx';

declare const buttonVariants: (props?: ({
    variant?: "primary" | "default" | "danger" | "destructive" | "secondary" | "outline" | "ghost" | "inverse" | null | undefined;
    size?: "default" | "xs" | "sm" | "md" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    /** leading icon (auto-sized: xs=14, sm=16, md=20, lg=24) */
    leftIcon?: ReactNode;
    /** trailing icon (auto-sized: xs=12, sm=16, md=20, lg=24) */
    rightIcon?: ReactNode;
    /** show a loading state (adopts disabled styling) and disable the button */
    loading?: boolean;
    className?: string;
}
/**
 * button — the base button atom.
 *
 * Built from the Figma "Button" component set. It supports
 * six visual types (primary, danger, secondary, outline, ghost, inverse) and
 * four sizes (lg, md, sm, xs). All states are driven by Tailwind pseudo
 * classes: hover, active (pressed) and disabled. The loading state adopts
 * the disabled styling (loading implies the disabled attribute).
 */
declare const Button: react.ForwardRefExoticComponent<ButtonProps & react.RefAttributes<HTMLButtonElement>>;

/**
 * badge — a small status/role label.
 *
 * Colour recipe from the Figma: fill {color}-25, border {color}-200,
 * text + dot {color}-500 (Success mapped exactly onto the green scale, so the
 * same recipe drives error/warning). Neutral and outline are grayscale.
 */
declare const badge: (props?: ({
    variant?: "default" | "destructive" | "outline" | "success" | "error" | "warning" | "neutral" | "purple" | null | undefined;
    size?: "sm" | "md" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface BadgeProps extends VariantProps<typeof badge> {
    children: ReactNode;
    /** colored status dot before the label (takes the text color) */
    dot?: boolean;
    /** optional leading icon */
    icon?: ReactNode;
    className?: string;
}
declare function Badge({ variant, size, dot, icon, children, className }: BadgeProps): react.JSX.Element;

type CheckboxSize = "small" | "medium" | "large";
interface CheckboxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
    /** on (checked) vs off (unchecked) */
    checked?: boolean;
    /** box size: small 12, medium 16, large 20 */
    size?: CheckboxSize;
    /** fires with the next checked value when toggled */
    onCheckedChange?: (checked: boolean) => void;
}
/**
 * checkbox — the on/off control (Figma component-set "checkbox", node 2169:5148).
 *
 * Three states across three sizes (small / medium / large):
 *   off     #b8b8b8 hairline, white fill
 *   hover   border darkens to #000000 (CSS :hover)
 *   on      #2b2b2b fill, white check (matches the date picker's selected fill)
 *
 * Disabled dims to 50%. Built as a role="checkbox" button so it keyboard-toggles
 * (Space / Enter) and merges className.
 */
declare function Checkbox({ checked, size, disabled, className, onCheckedChange, onClick, ...props }: CheckboxProps): react.JSX.Element;

interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
    size?: "sm" | "md";
    state?: "default" | "hover";
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}
declare function Switch({ size, state, checked, defaultChecked, disabled, onCheckedChange, className, ...props }: SwitchProps): react.JSX.Element;

type TagVariant = "default" | "add" | "removable" | "selected" | "placeholder";
interface TagProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: TagVariant;
    children: ReactNode;
}
declare function Tag({ variant, children, className, ...props }: TagProps): react.JSX.Element;

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
    /** md = 12px padding / 14px text (regular), sm = 8px padding all sides / 12px text (small) */
    size?: "sm" | "md";
    /** error styling (red border) */
    error?: boolean;
    /** leading icon inside the field (18px) */
    leading?: ReactNode;
    /** trailing icon inside the field (18px) */
    trailing?: ReactNode;
    /** flush left addon with a divider (e.g. a label dropdown) */
    prefix?: ReactNode;
    /** flush right addon with a divider */
    suffix?: ReactNode;
    containerClassName?: string;
    /** override the padding on the input area (e.g. a tighter sidebar field) */
    fieldClassName?: string;
}
/**
 * text-input — the raw input field.
 *
 * From Figma: fill gray-50 (#F5F5F5), 0.5px black/10 border, 6px radius. Focus
 * (via focus-within) turns the border black and adds a 3px black/10 ring;
 * error uses the red-500 border; disabled uses gray-100 fill with #8F8F8F
 * text. 14px text, #525252 placeholder. Cool grays are arbitrary values for
 * now, to be reconciled with the rest of the neutrals.
 *
 * NOTE: colors match the Figma exactly; the search-field composes this.
 */
type InputProps = TextInputProps;
declare function TextInput({ size, error, disabled, leading, trailing, prefix, suffix, containerClassName, fieldClassName, className, ...props }: TextInputProps): react.JSX.Element;
/** Alias matching the file name used by the app. */
declare const Input: typeof TextInput;

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    /** md = 12px padding / 14px text (regular), sm = 8px padding / 12px text (compact, mirrors TextInput sm) */
    size?: "sm" | "md";
    error?: boolean;
    containerClassName?: string;
}
declare const Textarea: react.ForwardRefExoticComponent<TextareaProps & react.RefAttributes<HTMLTextAreaElement>>;
/** Legacy aliases kept for compatibility. */
type TextAreaProps = TextareaProps;
declare const TextArea: react.ForwardRefExoticComponent<TextareaProps & react.RefAttributes<HTMLTextAreaElement>>;

/**
 * list-base — the shared row primitive.
 *
 * Every list-shaped component composes this: nav-item, footer-item,
 * menu-item, select-option, command-item. Slots + states only, no
 * navigation or selection logic (that lives in the composing component).
 *
 * NOTE: text/hover colors below use the brand "Neutral Gray" (cool) scale
 * from the Figma spec (#525252 text, #F5F5F5 hover, #A3A3A3 disabled).
 * These are arbitrary values for now — reconcile into `gray-*` tokens once
 * we settle warm vs cool neutrals across the system.
 */
type ListBaseSize = "sm" | "md";
declare const listBase: (props?: ({
    size?: "sm" | "md" | null | undefined;
    state?: "default" | "disabled" | "hover" | "selected" | null | undefined;
    tone?: "default" | "danger" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface ListBaseProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof listBase> {
    /** row height and text size (default `sm`) */
    size?: ListBaseSize;
    /** leading slot — icon, radio, checkbox, avatar */
    leading?: ReactNode;
    /** trailing slot — chevron, check, badge, shortcut */
    trailing?: ReactNode;
    /** the row label */
    children: ReactNode;
}
declare function ListBase({ size, leading, trailing, children, state, tone, className, ...props }: ListBaseProps): react.JSX.Element;

interface SeparatorProps {
    className?: string;
}
/**
 * separator — a hairline divider row for the sidebar (and menus).
 *
 * A 12px-tall row with the list-base 8px horizontal inset, holding a centered
 * 0.5px line. This inset makes the rule line up with the text of the rows above
 * and below rather than running full-bleed.
 *
 * NOTE: the line is black/10 per the Figma (rgba(0,0,0,0.1)). Reconcile into
 * --border-hairline with the rest of the neutrals later. Pass `className`
 * (e.g. px-0) for a full-bleed rule.
 */
declare function Separator({ className }: SeparatorProps): react.JSX.Element;

type LoadingSpinnerSize = "xs" | "s" | "md" | "lg" | "xl";
type LoadingSpinnerVariant = "filled" | "stroke" | "ring" | "dot";
interface LoadingSpinnerProps {
    size?: LoadingSpinnerSize;
    variant?: LoadingSpinnerVariant;
    label?: string;
    className?: string;
}
declare function LoadingSpinner({ size, variant, label, className, }: LoadingSpinnerProps): react.JSX.Element;

type SliderVariant = "default" | "range" | "no-value";
interface SliderProps {
    variant?: SliderVariant;
    min?: number;
    max?: number;
    value?: number;
    defaultValue?: number;
    valueEnd?: number;
    defaultValueEnd?: number;
    showValue?: boolean;
    onValueChange?: (value: number) => void;
    onRangeChange?: (range: [number, number]) => void;
    label?: string;
    className?: string;
}
declare function Slider({ variant, min, max, value, defaultValue, valueEnd, defaultValueEnd, showValue, onValueChange, onRangeChange, label, className, }: SliderProps): react.JSX.Element;

type TooltipPlacement = "top" | "right" | "bottom" | "left";
/** @deprecated Use TooltipPlacement. */
type TooltipSide = TooltipPlacement;
interface TooltipProps {
    children: ReactElement;
    body: ReactNode;
    title?: ReactNode;
    placement?: TooltipPlacement;
    /** @deprecated Use placement. */
    side?: TooltipSide;
    open?: boolean;
    defaultOpen?: boolean;
    className?: string;
}
declare function Tooltip({ children, body, title, placement, side, open, defaultOpen, className, }: TooltipProps): react.JSX.Element;

interface AvatarProps {
    /** image url; when omitted, the initials fallback is shown */
    src?: string;
    alt?: string;
    /** diameter, given in px at the base scale but rendered in rem so it scales
     *  with the app's root font-size (see index.css) */
    size?: number;
    /** initials shown when there is no image (e.g. "JH") */
    fallback?: string;
    className?: string;
}
/**
 * avatar — a circular user image with an initials fallback.
 *
 * 1px black/10 ring per the Figma. Image is object-cover; without a src it
 * renders the initials on a neutral fill, sized proportionally to the avatar.
 */
declare function Avatar({ src, alt, size, fallback, className }: AvatarProps): react.JSX.Element;

interface SegmentedButtonOption {
    value: string;
    label: string;
    /** optional count badge, shown only when provided */
    count?: number;
}
interface SegmentedButtonProps {
    options: SegmentedButtonOption[];
    /** the selected option's value */
    value: string;
    onChange: (value: string) => void;
    /** medium = the raw component (14px / 36px), small = the chart range tabs (12px / 22px) */
    size?: "medium" | "small";
    /** stretch the segments to equal width to fill the container (give it a width via className) */
    fill?: boolean;
    /** show the divider line between segments (default true) */
    dividers?: boolean;
    className?: string;
}
/**
 * segmented-button — a single-select button group with a sliding selection pill,
 * matching the forecast chart's control (#f5f5f5 track, #3d3d3d pill, #525252
 * idle, no hover state). Two sizes: medium (raw component 2176:7625) and small
 * (chart range tabs 2494:7304). Each segment can carry an optional count badge.
 */
declare function SegmentedButton({ options, value, onChange, size, fill, dividers, className, }: SegmentedButtonProps): react.JSX.Element;

type RadioSize = "sm" | "md" | "lg";
interface RadioProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
    size?: RadioSize;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}
/**
 * radio — a single-select control.
 *
 * Figma spec:
 *   sm: 12px outer, 8px inner dot (2px ring)
 *   md: 16px outer, 8px inner dot (4px ring)
 *   lg: 20px outer, 12px inner dot (4px ring)
 * Unchecked: 1px #B8B8B8 border, transparent background.
 * Hover/selected unchecked: border #201B18.
 * Checked: border #201B18, inner dot #201B18.
 */
declare function Radio({ size, checked, disabled, className, onCheckedChange, onClick, ...props }: RadioProps): react.JSX.Element;

/** Any icon component that accepts `size` plus standard SVG props. */
type IconComponent = ComponentType<{
    size?: number;
} & SVGProps<SVGSVGElement>>;
interface NavItemProps {
    /** Icon for the row. Omit on sub-list rows. */
    icon?: IconComponent;
    /** the row label */
    label: string;
    /** current page — the selected treatment */
    current?: boolean;
    /** show a chevron and mark the row expandable */
    expandable?: boolean;
    /** chevron points down when expanded, right when collapsed */
    expanded?: boolean;
    /** sub-list row: indented, no leading icon */
    sub?: boolean;
    /** destructive tone (e.g. Log out) */
    danger?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
    className?: string;
}
declare function NavItem({ icon: Icon, label, current, expandable, expanded, sub, danger, disabled, onClick, className, }: NavItemProps): react.JSX.Element;

interface NavSectionProps {
    /** section caption, rendered uppercase. Omit for an unlabeled group. */
    label?: string;
    /** the nav-items belonging to this section */
    children?: ReactNode;
    className?: string;
}
declare function NavSection({ label, children, className }: NavSectionProps): react.JSX.Element;

interface SearchResult {
    id: string;
    label: string;
    leading?: ReactNode;
    trailing?: ReactNode;
}
interface SearchFieldProps extends Omit<TextInputProps, "leading" | "prefix" | "suffix" | "results" | "trailing"> {
    /** results shown in the dropdown */
    results?: SearchResult[];
    /** force the dropdown open (defaults to open on focus) */
    open?: boolean;
    onSelectResult?: (result: SearchResult) => void;
    /** keyboard shortcut hint shown as a trailing kbd badge, e.g. "⌘K" */
    shortcut?: string;
    /** override the search icon size (defaults to 18 for md, 12 for sm) */
    iconSize?: number;
}
declare function SearchField({ results, open, onSelectResult, placeholder, containerClassName, shortcut, size, iconSize, ...props }: SearchFieldProps): react.JSX.Element;

interface AccountSwitcherProps {
    /** display name, e.g. "Jason Heim" */
    name: string;
    /** avatar image url; falls back to initials */
    avatarSrc?: string;
    /** initials for the avatar fallback, e.g. "JH" */
    initials?: string;
    /** role badge text, e.g. "Admin". Omit to hide the pill. */
    role?: string;
    /** profile menu trigger */
    onClick?: () => void;
    /** collapse-sidebar toggle (the panel icon) */
    onToggleSidebar?: () => void;
    className?: string;
}
declare function AccountSwitcher({ name, avatarSrc, initials, role, onClick, onToggleSidebar, className, }: AccountSwitcherProps): react.JSX.Element;

interface BreadcrumbItem {
    /** the crumb label */
    label: string;
    /** navigates when the crumb is an ancestor (not the current page) */
    href?: string;
    onClick?: () => void;
}
interface BreadcrumbProps {
    /** the trail, first to last. The LAST item is the current page (black). */
    items: BreadcrumbItem[];
    /**
     * Collapse the middle of the trail into an ellipsis menu once there are more
     * than this many items. The first item and the last two always stay visible.
     */
    maxItems?: number;
    className?: string;
}
declare function Breadcrumb({ items, maxItems, className }: BreadcrumbProps): react.JSX.Element | null;

interface KpiTrend {
    /** up = green rising triangle, down = red falling triangle */
    direction: "up" | "down";
    /** the delta shown beside the triangle, e.g. "6" */
    value: string;
}
interface KpiCardProps {
    label: string;
    value: string;
    /** rendered under the value, in the default size only */
    description?: string;
    /** a unit suffix rendered after the value, e.g. "/hr" (ignored if `trend` is set) */
    suffix?: string;
    /** a delta indicator (green up / red down) rendered after the value */
    trend?: KpiTrend;
    /** optional icon: top-right in the default size, leading in compact */
    icon?: ReactNode;
    size?: "default" | "compact";
    className?: string;
}
declare function KpiCard({ label, value, description, suffix, trend, icon, size, className, }: KpiCardProps): react.JSX.Element;

type LegendVariant = "square" | "line";
type LegendLineStyle = "dashed" | "dotted" | "solid";
interface LegendProps {
    variant?: LegendVariant;
    color: string;
    label: string;
    value?: string;
    percent?: string;
    dashed?: boolean;
    lineStyle?: LegendLineStyle;
    bordered?: boolean;
    className?: string;
}
declare function Legend({ variant, color, label, value, percent, dashed, lineStyle, bordered, className, }: LegendProps): react.JSX.Element;

declare const CHART_TOOLTIP_SHADOW = "0px 4px 8px 0px rgba(0,0,0,0.1),0px 2px 8px 0px rgba(0,0,0,0.15),0px 1px 2px 0px rgba(0,0,0,0.25),inset 0px 0px 0px 1px rgba(0,0,0,0.1),inset 0px -1px 1px 0px rgba(0,0,0,0.1),inset 0px 1px 2px 0px rgba(255,255,255,0.25)";
interface ChartTooltipItem {
    label: ReactNode;
    value?: ReactNode;
    color?: string;
    markerClassName?: string;
}
interface ChartTooltipProps {
    title: ReactNode;
    items: ChartTooltipItem[];
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
}
declare function ChartTooltip({ title, items, children, className, style }: ChartTooltipProps): react.JSX.Element;

type ProgressBarVariant = "default" | "labeled" | "indeterminate";
type ProgressBarSize = "small" | "medium" | "large";
interface ProgressBarProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    value?: number;
    max?: number;
    variant?: ProgressBarVariant;
    size?: ProgressBarSize;
    label?: string;
    color?: string;
    valueFormatter?: (value: number, max: number) => ReactNode;
    trackClassName?: string;
    fillClassName?: string;
    labelRowClassName?: string;
    labelClassName?: string;
    valueClassName?: string;
}
declare function ProgressBar({ value, max, variant, size, label, color, valueFormatter, className, trackClassName, fillClassName, labelRowClassName, labelClassName, valueClassName, ...props }: ProgressBarProps): react.JSX.Element;

type ProgressBarBaseSize = "sm" | "md" | "lg";
interface ProgressBarBaseProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
    percent: number;
    size?: ProgressBarBaseSize;
    color?: string;
    indeterminate?: boolean;
    trackClassName?: string;
    fillClassName?: string;
}
declare function ProgressBarBase({ percent, size, color, indeterminate, className, trackClassName, fillClassName, ...props }: ProgressBarBaseProps): react.JSX.Element;

interface ProgressValueBarProps {
    label: string;
    valueLabel: string;
    percent: number;
    color: string;
    className?: string;
    fillTextClassName?: string;
    trackTextClassName?: string;
    valueClassName?: string;
}
declare function ProgressValueBar({ label, valueLabel, percent, color, className, fillTextClassName, trackTextClassName, valueClassName, }: ProgressValueBarProps): react.JSX.Element;

/**
 * toast — dismissible status notification.
 *
 * Figma recipe: white surface, radius 12, padding 12, horizontal flex with
 * 16px gaps, three stacked drop shadows plus a white inset top highlight.
 * The four tones are identical except for the title, description and status
 * icon colors. The component sizes to its content; the 427px Figma frame is
 * treated as the maximum width, not a fixed width.
 */
declare const toastTitle: (props?: ({
    variant?: "default" | "success" | "error" | "warning" | "neutral" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type ToastVariant = NonNullable<VariantProps<typeof toastTitle>["variant"]>;
/** The four canonical tones; `"default"` is accepted as an alias of `"neutral"`. */
type ToastTone = "neutral" | "error" | "success" | "warning";
interface ToastProps {
    /** tone of the notification; `"default"` is kept as an alias of `"neutral"` */
    variant?: ToastVariant;
    /** show the 16px loading-spinner slot (default true, matching the Figma frame) */
    loading?: boolean;
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    onDismiss?: () => void;
    /** override the leading status-icon slot */
    icon?: ReactNode;
    className?: string;
}
declare function Toast({ variant, loading, title, description, actionLabel, onAction, onDismiss, icon, className, }: ToastProps): react.JSX.Element;

type DropZoneVisualState = "default" | "active" | "dragging";
interface DropZoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    state?: DropZoneVisualState;
    description?: string;
    maxSizeLabel?: string;
    onFiles?: (files: File[]) => void;
    className?: string;
}
declare function DropZone({ state, maxSizeLabel, description, disabled, multiple, accept, onFiles, className, ...inputProps }: DropZoneProps): react.JSX.Element;

type FileListStatus = "ready" | "uploading" | "uploaded" | "error";
interface FileListProps {
    status?: FileListStatus;
    name?: string;
    size?: string;
    progress?: number;
    onRemove?: () => void;
    onRetry?: () => void;
    className?: string;
}
declare function FileList({ status, name, size, progress, onRemove, onRetry, className, }: FileListProps): react.JSX.Element;

type ProgressRingSize = "sm" | "md" | "lg";
interface ProgressRingProps {
    value?: number;
    size?: ProgressRingSize;
    showPercent?: boolean;
    label?: string;
    className?: string;
}
declare function ProgressRing({ value, size, showPercent, label, className, }: ProgressRingProps): react.JSX.Element;

interface SkillLevelProps {
    level?: 1 | 2 | 3 | 4 | 5;
    max?: number;
    className?: string;
    label?: string;
}
declare function SkillLevel({ level, max, className, label }: SkillLevelProps): react.JSX.Element;

type EmptyStateMedia = "icon" | "avatar" | "none";
type EmptyStateActionVariant = "primary" | "secondary";
interface EmptyStateProps {
    /** media block above the copy: a 16px icon chip, a 24px avatar, or nothing */
    media?: EmptyStateMedia;
    /** override the media="icon" glyph (defaults to Bell) */
    icon?: ReactNode;
    /** image URL for media="avatar"; falls back to a neutral User chip when omitted */
    avatarSrc?: string;
    /** alt text for the avatar image */
    avatarAlt?: string;
    title: string;
    description?: string;
    /** renders the action button when provided */
    actionLabel?: string;
    /** optional 14px leading icon inside the action button */
    actionIcon?: ReactNode;
    /** action button style: white "secondary" chip or dark "primary" chip */
    actionVariant?: EmptyStateActionVariant;
    onAction?: () => void;
    className?: string;
}
declare function EmptyState({ media, icon, avatarSrc, avatarAlt, title, description, actionLabel, actionIcon, actionVariant, onAction, className, }: EmptyStateProps): react.JSX.Element;

type GanttBarState = "default" | "hover" | "focus" | "disabled";
interface GanttBarProps extends HTMLAttributes<HTMLDivElement> {
    state?: GanttBarState;
    children?: ReactNode;
}
declare function GanttBar({ state, children, className, ...props }: GanttBarProps): react.JSX.Element;

interface TextFieldBaseProps {
    /** label text shown above the field (14px / 500) */
    label: ReactNode;
    /** shows a red asterisk after the label; otherwise an "(Optional)" caption */
    required?: boolean;
    /** tooltip content — when present a trailing info icon (14px) appears in the label row */
    info?: ReactNode;
    /** hint text below the field (turns red when error) */
    hint?: ReactNode;
    /** error styling — red field border + red hint */
    error?: boolean;
    /** id for the inner input/textarea (auto-generated when omitted) */
    id?: string;
    /** className for the outer wrapper (the field column) */
    className?: string;
}
type TextFieldProps = TextFieldBaseProps & (({
    multiline?: false;
} & Omit<TextInputProps, "error">) | ({
    multiline: true;
} & Omit<TextareaProps, "error">));
/**
 * text-field — the complete form field: label row + field + hint row.
 *
 * Composes the existing TextInput (single-line) and Textarea (multiline); all
 * field sizes/variants/states pass straight through. From Figma: column flex
 * with 8px gaps; label row is a 2px-gap row (14px/500 label, red asterisk when
 * required, "(Optional)" #8F8F8F otherwise, trailing 14px info icon when the
 * field has tooltip content); hint row is a 4px-gap row (12px info icon + 12px
 * hint, #000000 default / red on error).
 *
 * NOTE: the asterisk uses the exact Figma red #C0180C; the error hint uses
 * red-500 to match the existing TextInput/Textarea error border.
 */
declare function TextField(props: TextFieldProps): react.JSX.Element;

/**
 * timeline — a step/track indicator with a connecting line and step dots.
 *
 * Figma recipe: a 16px cross-axis frame (197px tall vertical / 199px wide
 * horizontal) holding four ~10px green-500 filled circles distributed along
 * the frame's length and joined by a green-500 connecting line (in Figma the
 * line plus circles are a single 'Union' vector); each circle carries a small
 * white check glyph centered on top. The line renders first (behind); the
 * dots lay directly over it with no surrounding box or padding.
 *
 * Implementation: a full-length ~1.5px neutral-200 track plus a green-500
 * progress overlay reaching the last completed/current step. Steps are spaced
 * with justify-between, so step i's center sits at i/(n-1) of the track and
 * the overlay is sized with that percentage (n=1 renders no overlay).
 * Completed dots are green-500 (the same value as the success token, matching
 * badge/file-list); current is a white dot with a green-500 ring and center
 * dot; upcoming is a quiet neutral dot.
 *
 * Note: the neutral track/dot use arbitrary values (rgb(226 220 212) /
 * rgb(207 199 188), i.e. neutral-200/300) because the tailwind preset's
 * backgroundColor.neutral semantic key shadows the neutral ramp — the
 * bg-neutral-<shade> utilities never generate.
 */
declare const timeline: (props?: ({
    orientation?: "horizontal" | "vertical" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type TimelineOrientation = "vertical" | "horizontal";
type TimelineStepStatus = "completed" | "current" | "upcoming";
interface TimelineStep {
    /** Step state. Defaults to "completed" (the Figma depicts all-completed tracks). */
    status?: TimelineStepStatus;
    /** Accessible name for the step; also shown as a tooltip. */
    label?: string;
}
interface TimelineProps extends Omit<ComponentPropsWithoutRef<"div">, "children">, VariantProps<typeof timeline> {
    /** Number of steps, or an array of per-step descriptors. Defaults to 4 (per the Figma). */
    steps?: number | TimelineStep[];
    /** Accessible label for the whole track. */
    label?: string;
    className?: string;
}
declare function Timeline({ orientation, steps, label, className, ...props }: TimelineProps): react.JSX.Element;

type DropdownSize = "sm" | "md";
interface DropdownOption {
    /** the value handed to onChange */
    value: string;
    /** the label shown in the list and in the closed field */
    label: string;
    /** disabled options use the ListBase disabled state and cannot be chosen */
    disabled?: boolean;
}
interface DropdownProps {
    /**
     * md = 12px padding / 14px text (regular), sm = fixed 32px height / px-2 /
     * 12px text (small). The ListBase option rows follow the same size.
     */
    size?: DropdownSize;
    /** the options shown in the open list */
    options: DropdownOption[];
    /** controlled selected value */
    value?: string;
    /** uncontrolled initial value */
    defaultValue?: string;
    /** called with the value of the chosen option */
    onChange?: (value: string) => void;
    /** shown in the field when nothing is selected (input placeholder grey) */
    placeholder?: string;
    /** leading icon inside the field */
    leading?: ReactNode;
    /** error styling (red border) */
    error?: boolean;
    disabled?: boolean;
    /** force the list open (e.g. for docs); overrides the internal open state */
    open?: boolean;
    /**
     * type-to-filter mode: the closed field becomes an editable input — clicking
     * focuses it, typing opens the list and live-filters the options by a
     * case-insensitive substring match on the option label, Enter selects the
     * active option, and Escape clears the query (then closes the list). Defaults
     * to false, keeping the classic button trigger.
     */
    filterable?: boolean;
    className?: string;
    "aria-label"?: string;
}
/**
 * dropdown — select-style closed field + open list panel. Dependency-free.
 *
 * The closed field mirrors text-input: fill gray-50 (#F5F5F5), 0.5px black/10
 * border, 6px radius. Focus (via focus-within) turns the border black and adds
 * a 3px black/10 ring; error uses the red-500 border; disabled uses #EBEBEB
 * fill with #8F8F8F text and a not-allowed cursor. The field shows the
 * selected option label, or the placeholder in the input's #525252 placeholder
 * colour. The trailing ChevronDown rotates 180° while open.
 *
 * The open panel reuses the repo's popover recipe (white fill, 0.5px black/10
 * hairline, 6px radius, the shared popover shadow from breadcrumb /
 * search-field) and its rows are composed from ListBase — the row size follows
 * the dropdown's size prop, the selected row gets a trailing Check, and
 * disabled options use the ListBase disabled state.
 *
 * Behaviour: opens on click, closes on Escape and outside pointer-down.
 * Keyboard: ArrowUp/ArrowDown move the active option (wrapping, skipping
 * disabled), Enter/Space selects the active option.
 *
 * With `filterable` the trigger swaps from a button to an editable text input
 * on the same field recipe (same sizes, focus ring, error and disabled states,
 * same chevron). Typing opens the list and filters options by a
 * case-insensitive substring match on the label; an empty result renders a
 * single "No results" row. Enter picks the active option (the field text
 * becomes its label and onChange fires); Escape first clears the query, then
 * closes the list; closing the list always drops the query so the field falls
 * back to the selected label. Accessibility switches to the ARIA combobox
 * pattern (role="combobox" + aria-autocomplete="list" on the input,
 * aria-expanded, aria-controls and aria-activedescendant pointing at the
 * listbox); the classic mode keeps its button + listbox roles untouched.
 */
declare function Dropdown({ size, options, value, defaultValue, onChange, placeholder, leading, error, disabled, open, filterable, className, "aria-label": ariaLabel, }: DropdownProps): react.JSX.Element;

interface ComboboxChromeProps {
    /** label text shown above the field (14px / 500) */
    label: ReactNode;
    /** shows a red asterisk after the label; otherwise an "(Optional)" caption */
    required?: boolean;
    /** tooltip content — when present a trailing info icon (14px) appears in the label row */
    info?: ReactNode;
    /** hint text below the field (turns red when error) */
    hint?: ReactNode;
    /** error styling — red field border + red hint */
    error?: boolean;
    /** base id for the label/hint ids (auto-generated when omitted) */
    id?: string;
    /** className for the outer wrapper (the field column) */
    className?: string;
}
type ComboboxProps = ComboboxChromeProps & Omit<DropdownProps, "error" | "className">;
/**
 * combobox — the complete select-style form field: label row + dropdown + hint
 * row.
 *
 * Composes the existing Dropdown; every Dropdown prop (size, options,
 * value/defaultValue/onChange, placeholder, leading, disabled, open,
 * aria-label) passes straight through, so size="sm" renders the sm field AND
 * the sm list rows, and error renders Dropdown's red field border.
 *
 * The chrome mirrors text-field exactly: column flex with 8px gaps; label row
 * is a 2px-gap row (14px/500 label, red asterisk when required, "(Optional)"
 * #8F8F8F otherwise, trailing 14px info icon when the field has tooltip
 * content); hint row is a 4px-gap row (12px info icon + 12px hint, #000000
 * default / red on error).
 *
 * Accessibility: Dropdown's trigger is a button and (unlike TextInput) accepts
 * no id, so the text-field htmlFor pattern cannot target it. Instead the
 * wrapper is a role="group" labelled by the visible label and described by the
 * hint, and — when the label is a plain string — it is also passed to Dropdown
 * as aria-label so the trigger button itself gets the label as its accessible
 * name (an explicit aria-label prop always wins).
 */
declare function Combobox({ label, required, info, hint, error, id, className, ...dropdownProps }: ComboboxProps): react.JSX.Element;

/**
 * pagination — page navigation, rows-per-page selector, summary text, and
 * their full-width composition. From Figma node 96:2316.
 *
 * All text is 12px/16px regular. Colours: #000000 primary, #525252 secondary,
 * #F5F5F5 hover fill, rgba(0,0,0,0.1) hairlines, 6px radius — the same
 * hardcoded neutral recipe the newest components (dropdown / list-base) use,
 * pending reconciliation into gray-* tokens.
 *
 * Decisions documented in SPEC.md:
 * - the boxed (bordered) number page is the CURRENT page state; hover is the
 *   #F5F5F5 fill (the isolated Figma cells were ambiguous).
 * - number pages use secondary #525252 text, switching to primary #000000 on
 *   the current page (mirrors the rows-per-page option rows).
 * - the selected rows-per-page option does NOT get the Figma's leading
 *   users-01 icon — that is a placeholder artefact; selected = #000000 text +
 *   trailing 12px check.
 */
declare const pageButton: (props?: ({
    state?: "default" | "current" | "hover" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface PaginationPageButtonProps extends VariantProps<typeof pageButton> {
    /** the 1-based page number shown in the button */
    page: number;
    onClick?: (page: number) => void;
    className?: string;
}
declare function PaginationPageButton({ page, state, onClick, className }: PaginationPageButtonProps): react.JSX.Element;
declare const ELLIPSIS: "\u2026";
type PageItem = number | typeof ELLIPSIS;
/**
 * Ellipsis rule (siblingCount = s, edgeSize = 2s+1):
 * - pageCount <= edgeSize*2 + 1 → every page, no ellipsis.
 * - near an edge (current within the edge block) →
 *   `1 … edgeSize … N-edgeSize+1 … N`, e.g. the Figma `1 2 3 … 21 22 23`
 *   with s=1, page=1, pageCount=23. The edge block grows to keep the current
 *   page and its siblings visible.
 * - mid-range → `1 … page-s … page+s … N`.
 */
declare function getPaginationItems(page: number, pageCount: number, siblingCount?: number): PageItem[];
interface PaginationProps {
    /** controlled 1-based current page */
    page: number;
    /** total number of pages (>= 1) */
    pageCount: number;
    /** called with the requested 1-based page */
    onPageChange?: (page: number) => void;
    /** pages shown on each side of the current page; also sets the edge block
     *  size (2*siblingCount+1) and the ellipsis jump distance (default 1) */
    siblingCount?: number;
    previousLabel?: string;
    nextLabel?: string;
    className?: string;
    "aria-label"?: string;
}
declare function Pagination({ page, pageCount, onPageChange, siblingCount, previousLabel, nextLabel, className, "aria-label": ariaLabel, }: PaginationProps): react.JSX.Element;
interface PaginationRowsPerPageProps {
    /** controlled selected rows-per-page value */
    value: number;
    /** selectable values (default [10, 25, 50, 100]) */
    options?: number[];
    /** called with the chosen value */
    onChange?: (value: number) => void;
    /** leading label text (default "Rows per page") */
    label?: string;
    disabled?: boolean;
    /** force the panel open (e.g. for docs); overrides the internal open state */
    open?: boolean;
    className?: string;
    "aria-label"?: string;
}
/**
 * rows-per-page — label + 64x28 select-style trigger whose panel opens
 * UPWARD. Panel + rows follow the Figma spec (143px panel, 8px-padding rows,
 * hairline separators, trailing 12px check on the selected row) on the repo's
 * popover recipe (white, 0.5px black/10 hairline, 6px radius, the shared
 * popover shadow). Interaction mirrors Dropdown: click toggles, outside
 * pointer-down and Escape close, ArrowUp/ArrowDown move the active option,
 * Enter/Space selects.
 */
declare function PaginationRowsPerPage({ value, options, onChange, label, disabled, open, className, "aria-label": ariaLabel, }: PaginationRowsPerPageProps): react.JSX.Element;
interface PaginationSummaryProps {
    /** controlled 1-based current page */
    page: number;
    /** rows per page */
    pageSize: number;
    /** total number of rows */
    total: number;
    className?: string;
}
declare function PaginationSummary({ page, pageSize, total, className }: PaginationSummaryProps): react.JSX.Element;
interface PaginationFullProps extends Omit<PaginationProps, "className"> {
    /** rows-per-page value (rows per page selector) */
    pageSize: number;
    /** called with the chosen rows-per-page value */
    onPageSizeChange?: (value: number) => void;
    /** rows-per-page options (default [10, 25, 50, 100]) */
    pageSizeOptions?: number[];
    /** total number of rows (summary text) */
    total: number;
    /**
     * summary-start = Figma arrangement A (left: summary + "•" + rows-per-page,
     * right: pagination). summary-end = arrangement B (left: rows-per-page,
     * right: pagination + summary). Default "summary-start".
     */
    layout?: "summary-start" | "summary-end";
    rowsPerPageLabel?: string;
    className?: string;
}
declare function PaginationFull({ layout, page, pageCount, onPageChange, siblingCount, previousLabel, nextLabel, "aria-label": ariaLabel, pageSize, onPageSizeChange, pageSizeOptions, total, rowsPerPageLabel, className, }: PaginationFullProps): react.JSX.Element;

declare function cn(...inputs: ClassValue[]): string;

export { AccountSwitcher, type AccountSwitcherProps, Avatar, type AvatarProps, Badge, type BadgeProps, Breadcrumb, type BreadcrumbItem, type BreadcrumbProps, Button, type ButtonProps, CHART_TOOLTIP_SHADOW, ChartTooltip, type ChartTooltipItem, type ChartTooltipProps, Checkbox, type CheckboxProps, Combobox, type ComboboxProps, DropZone, type DropZoneProps, type DropZoneVisualState, Dropdown, type DropdownOption, type DropdownProps, type DropdownSize, EmptyState, type EmptyStateActionVariant, type EmptyStateMedia, type EmptyStateProps, FileList, type FileListProps, type FileListStatus, GanttBar, type GanttBarProps, type GanttBarState, type IconComponent, Input, type InputProps, KpiCard, type KpiCardProps, type KpiTrend, Legend, type LegendLineStyle, type LegendProps, type LegendVariant, ListBase, type ListBaseProps, type ListBaseSize, LoadingSpinner, type LoadingSpinnerProps, type LoadingSpinnerSize, type LoadingSpinnerVariant, NavItem, type NavItemProps, NavSection, type NavSectionProps, Pagination, PaginationFull, type PaginationFullProps, PaginationPageButton, type PaginationPageButtonProps, type PaginationProps, PaginationRowsPerPage, type PaginationRowsPerPageProps, PaginationSummary, type PaginationSummaryProps, ProgressBar, ProgressBarBase, type ProgressBarBaseProps, type ProgressBarBaseSize, type ProgressBarProps, type ProgressBarSize, type ProgressBarVariant, ProgressRing, type ProgressRingProps, type ProgressRingSize, ProgressValueBar, type ProgressValueBarProps, Radio, type RadioProps, type RadioSize, SearchField, type SearchFieldProps, type SearchResult, SegmentedButton, type SegmentedButtonOption, type SegmentedButtonProps, Separator, type SeparatorProps, SkillLevel, type SkillLevelProps, Slider, type SliderProps, type SliderVariant, Switch, type SwitchProps, Tag, type TagProps, type TagVariant, TextArea, type TextAreaProps, TextField, type TextFieldProps, TextInput, type TextInputProps, Textarea, type TextareaProps, Timeline, type TimelineOrientation, type TimelineProps, type TimelineStep, type TimelineStepStatus, Toast, type ToastProps, type ToastTone, type ToastVariant, Tooltip, type TooltipProps, type TooltipSide, buttonVariants, cn, getPaginationItems };
