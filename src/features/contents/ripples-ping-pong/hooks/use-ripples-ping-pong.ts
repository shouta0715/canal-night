import "client-only";

import p5 from "p5";
import { useCallback, useEffect, useRef } from "react";

import { useP5 } from "@/hooks/use-p5";
import { ContentProps } from "@/types";

const width = window.innerWidth;
const height = window.innerHeight;

type Data = {
  x: number;
  y: number;
  senderId: string;
};

const ballSpeed = 10;

export const useRipplesPingPong = ({ id, initialMode }: ContentProps) => {
  const rippleRef = useRef<
    { x: number; y: number; radius: number; alpha: number }[]
  >([]);

  const ballRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: 0,
    y: 0,
    vx: ballSpeed,
    vy: ballSpeed,
  });

  const { sendJsonMessage, canvasRef, onResize, p5Ref, mode } = useP5<Data>({
    callback: (_, data) => {
      if (data.senderId === id) return;

      const ripple = {
        ...data,
        radius: 0,
        alpha: 255,
      };

      rippleRef.current.push(ripple);
    },
    id,
    appName: "ripples-ping-pong",
    initialMode,
  });

  const updateBallPosition = useCallback(() => {
    if (!ballRef.current) return;

    ballRef.current.x += ballRef.current.vx;
    ballRef.current.y += ballRef.current.vy;

    if (ballRef.current.x < 0 || ballRef.current.x > width) {
      const position = {
        x: ballRef.current.x,
        y: ballRef.current.y,
      };

      const ripple = {
        ...position,
        radius: 0,
        alpha: 255,
      };
      sendJsonMessage({ ...position, senderId: id });
      rippleRef.current.push(ripple);

      ballRef.current.vx *= -1;
    }

    if (ballRef.current.y < 0 || ballRef.current.y > height) {
      const position = {
        x: ballRef.current.x,
        y: ballRef.current.y,
      };

      const ripple = {
        ...position,
        radius: 0,
        alpha: 255,
      };

      sendJsonMessage({ ...position, id });
      rippleRef.current.push(ripple);
      ballRef.current.vy *= -1;
    }
  }, [id, sendJsonMessage]);

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
          p5Instance.noFill();
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

        p5Instance.fill(255);
        p5Instance.ellipse(ballRef.current.x, ballRef.current.y, 20, 20);
        p5Instance.noFill();
        updateBallPosition();
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
  }, [canvasRef, id, mode, onResize, p5Ref, updateBallPosition]);

  return {
    canvasRef,
  };
};
