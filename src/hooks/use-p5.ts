import p5 from "p5";
import { useCallback, useRef } from "react";
import { useDebounce, useSocket } from "@/hooks";
import { fetchResize } from "@/utils";

type UseP5Props<T> = {
  id: string;
  appName: string;
  callback: (p: p5, data: T) => void;
};

const width = window.innerWidth;
const height = window.innerHeight;

export function useP5<T>({ id, callback, appName }: UseP5Props<T>) {
  if (typeof window === "undefined") throw new Error("window is not defined");
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const debounce = useDebounce(300);

  const socket = useSocket<T>({
    id,
    width,
    height,
    appName,
    callback: (data) => {
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
    ...socket,
  };
}
