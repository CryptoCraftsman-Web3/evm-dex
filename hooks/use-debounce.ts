import { useEffect, useState } from 'react';

export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}