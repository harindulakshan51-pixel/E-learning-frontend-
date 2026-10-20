import { useEffect } from 'react';

// A browser UI deterrent only; video access must still be enforced by the server.
export function useAntiInspection(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const blockContextMenu = (event) => event.preventDefault();
    const blockShortcuts = (event) => {
      const key = event.key.toLowerCase();
      const blocked = key === 'f12' ||
        (event.ctrlKey && event.shiftKey && (key === 'i' || key === 'j')) ||
        (event.ctrlKey && key === 'u');

      if (blocked) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', blockContextMenu);
    window.addEventListener('keydown', blockShortcuts, true);
    const intervalId = window.setInterval(() => {
      // Intentional deterrent: pauses only when the debugger honors breakpoints.
      // eslint-disable-next-line no-debugger
      debugger;
    }, 1000);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      window.removeEventListener('keydown', blockShortcuts, true);
      window.clearInterval(intervalId);
    };
  }, [enabled]);
}
