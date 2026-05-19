import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /**
   * Skip `overflow-hidden` so absolute-positioned popovers (Dropdown menus,
   * Tooltips, etc.) can escape the card boundary. Default false — card
   * clips content to the rounded corners.
   */
  noClip?: boolean;
  /**
   * Content alignment inside the card. `center` (default) for single-item
   * previews; `start` for multi-row grids where centering looks ragged.
   */
  align?: 'center' | 'start';
}

export function PreviewCard({ children, noClip = false, align = 'center' }: Props) {
  const justify = align === 'start' ? 'justify-start' : 'justify-center';
  const items = align === 'start' ? 'items-start' : 'items-center';
  return (
    <div
      className={`preview-card my-6 rounded-lg border border-default bg-canvas ${
        noClip ? '' : 'overflow-hidden'
      }`}
    >
      <div className={`flex min-h-[160px] ${items} ${justify} p-8`}>
        {children}
      </div>
    </div>
  );
}
