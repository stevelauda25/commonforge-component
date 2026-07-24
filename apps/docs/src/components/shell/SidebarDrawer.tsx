import { useEffect } from 'react';
import { Sidebar } from './Sidebar.js';
import { cn } from '@commonforge/ui';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SidebarDrawer({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-overlay/40 transition-opacity md:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />
      <div
        role="dialog"
        aria-label="Navigation"
        aria-modal="true"
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform md:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <Sidebar onNavigate={onClose} />
      </div>
    </>
  );
}
