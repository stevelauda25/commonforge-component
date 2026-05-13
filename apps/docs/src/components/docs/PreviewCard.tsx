import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /**
   * Skip `overflow-hidden` so absolute-positioned popovers (Dropdown menus,
   * Tooltips, etc.) can escape the card boundary. Default false — card
   * clips content to the rounded corners.
   */
  noClip?: boolean;
}

export function PreviewCard({ children, noClip = false }: Props) {
  return (
    <div
      className={`preview-card my-6 rounded-lg border border-border-default bg-canvas ${
        noClip ? '' : 'overflow-hidden'
      }`}
    >
      <div className="flex min-h-[160px] items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}
