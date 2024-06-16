"use client";

import { useCallback, useRef, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "@/constant";

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

type UseSocketProps<T> = {
  callback: (data: T) => void;
  width: number;
  height: number;
  id: string;
  appName: string;
};

export const useSocket = <T>({
  callback,
  id,
  width,
  height,
  appName,
}: UseSocketProps<T>) => {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket<T>(
    `${WS_URL}/${appName}/${id}`,
    {
      queryParams: {
        width,
        height,
      },
    }
  );

  useEffect(() => {
    if (!lastJsonMessage) return;

    callback(lastJsonMessage);
  }, [callback, lastJsonMessage]);

  return { lastJsonMessage, sendJsonMessage };
};
