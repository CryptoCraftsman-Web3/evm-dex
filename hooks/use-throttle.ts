import { useEffect, useRef, useState } from 'react';

export default function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastValue = useRef(value);
  useEffect(() => {
    if (value !== lastValue.current) {
      setThrottledValue(value);
      lastValue.current = value;
      const timeoutId = setTimeout(() => {
        setThrottledValue(value);
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [value, delay]);
  return throttledValue;
}
