import p5 from "p5";
import { useCallback, useRef } from "react";
import { Mode } from "@/features/admin/store";
import { useDebounce, useMode, useSocket } from "@/hooks";
import { UserState } from "@/types";
import { fetchResize } from "@/utils";

type UseP5Props<T, C extends object> = {
  id: string;
  appName: string;
  callback: (p: p5, data: T) => void;
  onJoin?: (state: UserState<C>) => void;
  initialMode: Mode;
};

const width = window.innerWidth;
const height = window.innerHeight;

export function useP5<
  T extends Record<string, unknown>,
  C extends object = object,
>({ id, callback, onJoin, appName, initialMode }: UseP5Props<T, C>) {
  if (typeof window === "undefined") throw new Error("window is not defined");
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const debounce = useDebounce(300);

  const { onModeRedirect, mode } = useMode(appName, initialMode);

  const socket = useSocket<T>({
    id,
    width,
    height,
    appName,
    callback: (data) => {
      if (data?.action === "mode" && data?.mode) {
        onModeRedirect(data.mode as Mode);
      }

      if (data?.action === "join" && data?.state) {
        onJoin?.(data.state as UserState<C>);
      }

      const p5Instance = p5Ref.current;
      if (!p5Instance) return;
      callback(p5Instance, data);
    },
  });

  const onResize = useCallback(
    (p: p5) => {
      if (!p) return;
      debounce(async () => {
        await fetchResize({ id, appName: "ripples" });
      });
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    },
    [debounce, id]
  );

  return {
    canvasRef,
    p5Ref,
    onResize,
    width,
    height,
    mode,
    ...socket,
  };
}
