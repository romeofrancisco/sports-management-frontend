import { useEffect } from 'react';

/**
 * Hook for handling keyboard shortcuts in the Player Metrics Recording component
 */
export const useKeyboardShortcuts = ({
  onPreviousPlayer,
  onNextPlayer,
  onSave,
  onReset,
  isEnabled = true
}) => {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event) => {
      // Check if user is typing in an input field
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
      
      // Alt + Arrow keys for navigation (works even when typing)
      if (event.altKey && !event.shiftKey && !event.ctrlKey) {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault();
            onPreviousPlayer?.();
            break;
          case 'ArrowRight':
            event.preventDefault();
            onNextPlayer?.();
            break;
        }
        return;
      }

      // Don't trigger other shortcuts when typing
      if (isTyping) return;

      // Ctrl/Cmd + key combinations
      if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault();
            onSave?.();
            break;
          case 'r':
            event.preventDefault();
            onReset?.();
            break;
        }
      }

      // Escape key
      if (event.key === 'Escape') {
        // Close any open modals or dialogs
        const openDialogs = document.querySelectorAll('[role="dialog"]');
        if (openDialogs.length > 0) {
          event.preventDefault();
          // Trigger close on the last opened dialog
          const lastDialog = openDialogs[openDialogs.length - 1];
          const closeButton = lastDialog.querySelector('[aria-label="Close"]');
          closeButton?.click();
        }
      }

      // Question mark for help
      if (event.key === '?' && !event.shiftKey) {
        event.preventDefault();
        // This could trigger a help modal or shortcuts display
        console.log('Help requested');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPreviousPlayer, onNextPlayer, onSave, onReset, isEnabled]);
};

export default useKeyboardShortcuts;
