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
    /** leading icon (auto-sized: xs=12, sm=16, md=20, lg=24) */
    leftIcon?: ReactNode;
    /** trailing icon (auto-sized: xs=12, sm=16, md=20, lg=24) */
    rightIcon?: ReactNode;
    /** show a loading state and disable the button */
    loading?: boolean;
    className?: string;
}
/**
 * button — the base button atom.
 *
 * Built from the Figma "Button" component set. It supports
 * six visual types (primary, danger, secondary, outline, ghost, inverse) and
 * four sizes (lg, md, sm, xs). All states are driven by Tailwind pseudo
 * classes: hover, active (pressed) and disabled.
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

type ToastVariant = "default" | "error" | "success" | "warning";
interface ToastProps {
    variant?: ToastVariant;
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    onDismiss?: () => void;
    icon?: ReactNode;
    className?: string;
}
declare function Toast({ variant, title, description, actionLabel, onAction, onDismiss, icon, className, }: ToastProps): react.JSX.Element;

type DropZoneVisualState = "default" | "active" | "dragging";
interface DropZoneProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    state?: DropZoneVisualState;
    description?: string;
    maxSizeLabel?: string;
    onFiles?: (files: File[]) => void;
    className?: string;
}
declare function DropZone({ state, maxSizeLabel, description, disabled, multiple, accept, onFiles, className, ...inputProps }: DropZoneProps): react.JSX.Element;

type FileListState = "default" | "uploading" | "success" | "failed";
interface FileListProps {
    state?: FileListState;
    fileName?: string;
    fileSize?: string;
    progress?: number;
    onRemove?: () => void;
    onRetry?: () => void;
    className?: string;
}
declare function FileList({ state, fileName, fileSize, progress, onRemove, onRetry, className, }: FileListProps): react.JSX.Element;

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

type EmptyStateVariant = "default" | "avatar" | "compact";
interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: ReactNode;
    className?: string;
}
declare function EmptyState({ variant, title, description, actionLabel, onAction, icon, className, }: EmptyStateProps): react.JSX.Element;

type GanttBarState = "default" | "hover" | "focus" | "disabled";
interface GanttBarProps extends HTMLAttributes<HTMLDivElement> {
    state?: GanttBarState;
    children?: ReactNode;
}
declare function GanttBar({ state, children, className, ...props }: GanttBarProps): react.JSX.Element;

declare function cn(...inputs: ClassValue[]): string;

export { AccountSwitcher, type AccountSwitcherProps, Avatar, type AvatarProps, Badge, type BadgeProps, Breadcrumb, type BreadcrumbItem, type BreadcrumbProps, Button, type ButtonProps, CHART_TOOLTIP_SHADOW, ChartTooltip, type ChartTooltipItem, type ChartTooltipProps, Checkbox, type CheckboxProps, DropZone, type DropZoneProps, type DropZoneVisualState, EmptyState, type EmptyStateProps, type EmptyStateVariant, FileList, type FileListProps, type FileListState, GanttBar, type GanttBarProps, type GanttBarState, type IconComponent, Input, type InputProps, KpiCard, type KpiCardProps, type KpiTrend, Legend, type LegendLineStyle, type LegendProps, type LegendVariant, ListBase, type ListBaseProps, type ListBaseSize, LoadingSpinner, type LoadingSpinnerProps, type LoadingSpinnerSize, type LoadingSpinnerVariant, NavItem, type NavItemProps, NavSection, type NavSectionProps, ProgressBar, ProgressBarBase, type ProgressBarBaseProps, type ProgressBarBaseSize, type ProgressBarProps, type ProgressBarSize, type ProgressBarVariant, ProgressRing, type ProgressRingProps, type ProgressRingSize, ProgressValueBar, type ProgressValueBarProps, Radio, type RadioProps, type RadioSize, SearchField, type SearchFieldProps, type SearchResult, SegmentedButton, type SegmentedButtonOption, type SegmentedButtonProps, Separator, type SeparatorProps, SkillLevel, type SkillLevelProps, Slider, type SliderProps, type SliderVariant, Switch, type SwitchProps, Tag, type TagProps, type TagVariant, TextArea, type TextAreaProps, TextInput, type TextInputProps, Textarea, type TextareaProps, Toast, type ToastProps, type ToastVariant, Tooltip, type TooltipProps, type TooltipSide, buttonVariants, cn };
