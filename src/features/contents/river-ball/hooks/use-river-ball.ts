import Matter from "matter-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { RiverBallData } from "@/features/contents/river-ball/api/use-river-ball-api";

const IMAGE_URL = "http://localhost:8787/river-ball/images";

type UseRiverBallProps = {
  data: RiverBallData | null;
};

export function useRiverBall({ data }: UseRiverBallProps) {
  const matterEngine = useRef<Matter.Engine | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const render = useRef<Matter.Render | null>(null);
  const runner = useRef<Matter.Runner | null>(null);
  const [{ w, h }, setWH] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  const renderBall = useCallback(
    (xx: number, yy: number, width: number, wheelSize: number, id?: string) => {
      const { Bodies } = Matter;

      const wheelBase = 20;
      const wheelAOffset = -width * 0.5 + wheelBase;

      const wheelYOffset = 0;

      const ball = Bodies.circle(
        xx + wheelAOffset,
        yy + wheelYOffset,
        wheelSize,
        {
          density: 0.0001, // 軽く設定
          friction: 0.0001, // 転がり摩擦を適度に設定
          frictionAir: 0.001, // 空気抵抗を適度に設定
          restitution: 0.6, // 反発係数
          render: {
            strokeStyle: "#ffffff",
            fillStyle: "#ffffff",

            sprite: id
              ? {
                  texture: `${IMAGE_URL}/${id}`,
                  xScale: 0.5,
                  yScale: 0.5,
                }
              : undefined,
          },
        }
      );

      return ball;
    },
    []
  );

  const renderWall = useCallback(
    (world: Matter.World) => {
      const { Bodies, Composite } = Matter;

      const left = Bodies.rectangle(0, h / 2, 40, h, {
        isStatic: true,
        render: { fillStyle: "#060a19" },
      });
      const right = Bodies.rectangle(w, h / 2, 40, h, {
        isStatic: true,
        render: { fillStyle: "#060a19" },
      });

      Composite.add(world, [left, right]);
    },
    [h, w]
  );

  const addBallHandler = useCallback(
    (id?: string) => {
      if (!matterEngine.current) return;
      const { world } = matterEngine.current;

      const scale = 0.9;
      const ball = renderBall(150, 100, 150 * scale, 30 * scale, id);

      Matter.Body.setVelocity(ball, { x: 10, y: -5 });

      Matter.Body.setAngularVelocity(ball, 0.2);

      Matter.Composite.add(world, ball);
    },
    [renderBall]
  );

  useEffect(() => {
    if (!data) return;

    addBallHandler(data.id);
  }, [addBallHandler, data]);

  const renderRectangles = useCallback(
    (world: Matter.World) => {
      const { Bodies, Composite } = Matter;

      const width = w * 0.7;

      const spacing = Math.max(200, h / 5);
      const recHeight = 20;
      const num = Math.floor(h / spacing);

      const rects = Array.from({ length: num }, (_, i) => {
        const isLast = i === num - 1;
        const x = i % 2 === 0 ? width / 2 : width;
        const y = (i + 1) * spacing;

        const angle = Math.PI * 0.07 * (i % 2 === 0 ? 1 : -1);

        return Bodies.rectangle(x, y, isLast ? w : width, recHeight, {
          isStatic: true,
          angle: isLast ? 0 : angle,
          render: { fillStyle: "#060a19" },
          density: 0.001, // ボールを軽く設定
          friction: 0.01, // 転がり摩擦を低く設定
          frictionAir: 0.01, // 空気抵抗を低く設定
          restitution: 0.6, // 反発係数
        });
      });

      Composite.add(world, rects);
    },
    [h, w]
  );

  const onResize = useCallback(() => {
    setWH({ w: window.innerWidth, h: window.innerHeight });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  useEffect(() => {
    if (!ref.current) return () => {};

    const { Engine, Render, Runner } = Matter;

    matterEngine.current = matterEngine.current || Engine.create();
    const { world } = matterEngine.current;

    render.current = Render.create({
      element: document.body,
      engine: matterEngine.current,
      options: {
        width: w,
        height: h,
        wireframes: false,
        background: "transparent",
      },
    });

    if (!render.current) return () => {};

    Render.run(render.current);

    runner.current = Runner.create();

    Runner.run(runner.current, matterEngine.current);

    renderRectangles(world);
    renderWall(world);

    return () => {
      if (render.current) {
        Render.stop(render.current);
      }

      if (runner.current) {
        Runner.stop(runner.current);
      }

      if (matterEngine.current) {
        Engine.clear(matterEngine.current);
      }

      if (render.current) {
        render.current.canvas.remove();
      }

      matterEngine.current = null;
      render.current = null;
      runner.current = null;
    };
  }, [h, renderBall, renderRectangles, renderWall, w]);

  return { ref, addBallHandler };
}
