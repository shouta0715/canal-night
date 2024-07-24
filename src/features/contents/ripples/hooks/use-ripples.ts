import "client-only";

import p5 from "p5";
import { useEffect, useRef } from "react";

import { useP5 } from "@/hooks/use-p5";
import { ContentProps } from "@/types";

type Data =
  | {
      x: number;
      y: number;
      senderId: string;
      action: "interaction";
    }
  | {
      action: "device";
      custom: { color: string };
    };

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const hexWithoutHash = hex.replace(/^#/, "");

  let normalizedHex = hexWithoutHash;
  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // 16進数を整数に変換
  const bigint = parseInt(normalizedHex, 16);
  const r = Math.floor(bigint / (256 * 256));
  const g = Math.floor((bigint / 256) % 256);
  const b = Math.floor(bigint % 256);

  return { r, g, b };
}

export const useRipples = ({ id, initialMode }: ContentProps) => {
  const rippleRef = useRef<
    { x: number; y: number; radius: number; alpha: number }[]
  >([]);

  const colorRef = useRef({ r: 0, g: 0, b: 0 });

  const {
    onResize,
    sendJsonMessage,
    canvasRef,
    p5Ref,
    width,
    height,
    mode,
    isConnecting,
  } = useP5<Data, { color: string }>({
    callback: (_, data) => {
      if (data.action === "device") {
        const { r, g, b } = hexToRgb(data.custom.color);
        colorRef.current = { r, g, b };

        return;
      }
      if (data.action === "interaction") {
        if (data.senderId === id) return;
        const ripple = {
          ...data,
          radius: 0,
          alpha: 255,
        };

        rippleRef.current.push(ripple);
      }
    },
    id,
    appName: "ripples",
    initialMode,
    onJoin: (state) => {
      const { custom } = state;
      const { r, g, b } = hexToRgb(custom?.color || "#4DD7E3");
      colorRef.current = { r, g, b };
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    if (mode === "connect") return () => {};

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
          const color = colorRef.current;
          p5Instance.stroke(color.r, color.g, color.b, r.alpha);
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
        sendJsonMessage({ ...position, id });

        ripples.push(ripple);
      };

      p5Instance.windowResized = () => onResize(p5Instance);
    };

    // eslint-disable-next-line new-cap
    const p5Instance = new p5(sketch);

    p5Ref.current = p5Instance;

    return () => {
      if (!p5Ref.current) return;
      p5Ref.current.remove();
    };
  }, [canvasRef, height, id, mode, onResize, p5Ref, sendJsonMessage, width]);

  return {
    canvasRef,
    mode,
    isConnecting,
  };
};
