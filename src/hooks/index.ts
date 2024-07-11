"use client";

import { useMutation } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useRef, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "@/constant";
import { changeMode } from "@/features/admin/api";
import { Mode } from "@/features/admin/store";

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
  const callbackRef = useRef(callback);
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket<T>(
    `${WS_URL}/${appName}/${id}`,
    {
      queryParams: {
        width,
        height,
      },
      share: true,
    }
  );

  const isConnecting = readyState === 0;

  useEffect(() => {
    if (!lastJsonMessage) return;

    callbackRef.current(lastJsonMessage);
  }, [lastJsonMessage]);

  return { lastJsonMessage, sendJsonMessage, isConnecting };
};

export const useMode = (appName: string, initialMode: Mode = "view") => {
  const searchParams = useSearchParams();
  const mode = (searchParams.get("mode") || initialMode) as Mode;
  const pathname = usePathname();
  const debounce = useDebounce(300);

  const { mutate } = useMutation({ mutationFn: changeMode });

  const onModeRedirect = (m: Mode) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("mode", m);
    window.history.pushState(
      {},
      "",
      `${pathname}?${newSearchParams.toString()}`
    );
  };

  const onChangeMode = (checked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("mode", checked ? "connect" : "view");

    window.history.pushState(
      {},
      "",
      `${pathname}?${newSearchParams.toString()}`
    );

    debounce(() => {
      mutate({ appName, mode: checked ? "connect" : "view" });
    });
  };

  const isConnectMode = mode === "connect";

  return { mode, onChangeMode, isConnectMode, onModeRedirect };
};
