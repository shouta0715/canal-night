"use client";

import { useCallback, useRef } from "react";

export function useDebounce(ms: number): (fn: () => void) => void {
  const timer = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    (fn: () => void) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(fn, ms);
    },
    [ms]
  );

  return debounce;
}
