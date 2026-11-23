type ClassValue = string | boolean | undefined | null | Record<string, boolean>;

/**
 * Combina classes CSS condicionalmente
 */
export function cn(...classes: ClassValue[]): string {
  return classes
    .map((cls) => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .filter(Boolean)
    .join(' ');
}
