export function announceToScreenReader(message: string): void {
  if (typeof document === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };
  
  element.addEventListener('keydown', handleTabKey);
  firstElement?.focus();
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

export function getAriaLabel(element: string, context?: string): string {
  const labels: Record<string, string> = {
    'close-button': 'Close',
    'menu-button': 'Open menu',
    'search-button': 'Search',
    'next-page': 'Next page',
    'previous-page': 'Previous page',
  };
  
  const label = labels[element] || element;
  return context ? `${label} ${context}` : label;
}

export function checkColorContrast(
  foreground: string,
  background: string
): { ratio: number; passesAA: boolean; passesAAA: boolean } {
  // Simplified contrast calculation
  // In production, use a proper color contrast library
  const ratio = 4.5; // Placeholder
  
  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
}

export const keyboardShortcuts = {
  'Escape': 'Close dialog or cancel action',
  'Enter': 'Confirm or submit',
  'Space': 'Select or toggle',
  'ArrowUp': 'Navigate up',
  'ArrowDown': 'Navigate down',
  'Tab': 'Navigate to next element',
  'Shift+Tab': 'Navigate to previous element',
  '/': 'Focus search',
};

export function handleKeyboardNavigation(
  event: KeyboardEvent,
  handlers: Record<string, () => void>
): void {
  const key = event.key;
  const handler = handlers[key];
  
  if (handler) {
    event.preventDefault();
    handler();
  }
}
