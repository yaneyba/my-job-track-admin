import { useState, useEffect } from 'react';
import { debounce } from '@/lib/utils';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value);
    }, delay);

    handler();

    return () => {
      // Cleanup function to cancel debounce if needed
    };
  }, [value, delay]);

  return debouncedValue;
}
