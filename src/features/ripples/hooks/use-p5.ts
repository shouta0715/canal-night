import "client-only";

import p5 from "p5";
import { useEffect, useRef } from "react";
import { fetchResize } from "@/features/ripples/api";
import { useSocket } from "@/features/ripples/hooks/use-socket";
import { useDebounce } from "@/hooks";

const width = window.innerWidth;
const height = window.innerHeight;

type Data = {
  x: number;
  y: number;
  senderId: string;
};

type UseP5Props = {
  id: string;
};

export const useP5 = ({ id }: UseP5Props) => {
  if (typeof window === "undefined") throw new Error("window is not defined");
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);
  const rippleRef = useRef<
    { x: number; y: number; radius: number; alpha: number }[]
  >([]);
  const debounce = useDebounce(300);

  const { sendJsonMessage } = useSocket<Data>({
    id,
    width,
    height,
    callback: (data) => {
      const p5Instance = p5Ref.current;
      if (!p5Instance) return;

      const ripple = {
        ...data,
        radius: 0,
        alpha: 255,
      };

      rippleRef.current.push(ripple);
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};

    const sketch = (p: p5) => {
      const p5Instance = p;
      const ripples = rippleRef.current;

      p5Instance.setup = () => {
        const c = p.createCanvas(width, height);
        p.noFill();
        c.parent(canvas);
      };

      p5Instance.draw = () => {
        p5Instance.background(0);

        // eslint-disable-next-line no-plusplus
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          p5Instance.stroke(77, 215, 227, r.alpha);
          p5Instance.strokeWeight(4);
          p5Instance.ellipse(r.x, r.y, r.radius * 10, r.radius * 10);

          r.radius += 1;
          r.alpha -= 1;

          // 透明度が0以下なら削除
          if (r.alpha <= 0) {
            ripples.splice(i, 1);
          }
        }
      };

      p5Instance.mousePressed = () => {
        const x = p5Instance.mouseX;
        const y = p5Instance.mouseY;

        if (x === 0 && y === 0) return;

        const position = {
          x: p5Instance.mouseX,
          y: p5Instance.mouseY,
        };

        const ripple = {
          ...position,
          radius: 0,
          alpha: 255,
          blur: 0,
        };

        if (!id) throw new Error("id is required");
        sendJsonMessage({ ...position, senderId: id });

        ripples.push(ripple);
      };

      p5Instance.windowResized = () => {
        debounce(async () => {
          await fetchResize({ id, appName: "ripples" });
        });
        p5Instance.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    // eslint-disable-next-line new-cap
    const p5Instance = new p5(sketch);

    p5Ref.current = p5Instance;

    return () => {
      if (!p5Ref.current) return;
      p5Ref.current.remove();
    };
  }, [debounce, id, sendJsonMessage]);

  return {
    canvasRef,
  };
};
