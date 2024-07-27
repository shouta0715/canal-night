import Matter, { Events, Render } from "matter-js";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { Alignment } from "@/features/admin/types";

import {
  RiverBallData,
  useMutateOver,
} from "@/features/contents/canal-night/api/use-canal-night-api";
import { UserState } from "@/types";

const IMAGE_URL = "http://localhost:8787/river-ball/images";

type UseRiverBallProps = {
  data: RiverBallData | null;
  state?: UserState;
  alignment: Alignment;
};

export function useRiverBall({ data, state, alignment }: UseRiverBallProps) {
  const matterEngine = useRef<Matter.Engine | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const ref = useRef<HTMLDivElement>(null);
  const render = useRef<Matter.Render | null>(null);
  const runner = useRef<Matter.Runner | null>(null);
  const sizeRef = useRef({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  const { mutate } = useMutateOver();

  const renderBall = useCallback((x: number, y: number, id?: string) => {
    const { Bodies } = Matter;

    const wheelBase = 20;
    const wheelAOffset = -300 * 0.5 + wheelBase;

    const wheelYOffset = 0;

    const scale = 0.35;

    const ball = Bodies.circle(
      150 + x + wheelAOffset,
      100 + y + wheelYOffset,
      150 * scale,
      {
        label: "ball",
        density: 0.0001, // 軽く設定
        friction: 0.0001, // 転がり摩擦を適度に設定
        frictionAir: 0.001, // 空気抵抗を適度に設定
        restitution: 0.6, // 反発係数
        render: {
          sprite: id
            ? {
                texture: `${IMAGE_URL}/${id}`,
                xScale: scale,
                yScale: scale,
              }
            : undefined,
        },
      }
    );

    return ball;
  }, []);

  const renderWall = useCallback(
    (world: Matter.World, isLeft: boolean, isRight: boolean) => {
      const { Bodies, Composite } = Matter;

      const { w, h } = sizeRef.current;

      const left = Bodies.rectangle(0, h / 2, 40, h, {
        isStatic: true,
      });
      const right = Bodies.rectangle(w, h / 2, 40, h, {
        isStatic: true,
      });

      Composite.add(world, [
        ...(isLeft ? [left] : []),
        ...(isRight ? [right] : []),
      ]);
    },
    []
  );

  const addBallHandler = useCallback(
    (x: number, y: number, id?: string, direction?: "left" | "right") => {
      if (!matterEngine.current) return;
      const { world } = matterEngine.current;

      const ball = renderBall(x, y, id);
      Matter.Body.setVelocity(ball, {
        x: direction === "right" ? -5 : 5,
        y: 0,
      });

      Matter.Body.setAngularVelocity(ball, 0.2);

      Matter.Composite.add(world, ball);
    },
    [renderBall]
  );

  useEffect(() => {
    if (!data) return;

    if (data.action === "uploaded") {
      addBallHandler(0, 0, data.id);
    }

    if (data.action === "over") {
      addBallHandler(
        data.x,
        data.y,
        data.id,
        data.to === "left" ? "left" : "right"
      );
    }
  }, [addBallHandler, data]);

  const renderRectangles = useCallback((world: Matter.World) => {
    const { Bodies, Composite } = Matter;

    const { w, h } = sizeRef.current;
    const width = w * 0.7;

    const spacing = Math.max(100, h / 7);
    const recHeight = 20;
    const num = Math.floor(h / spacing);

    const rects = Array.from({ length: num }, (_, i) => {
      const isLast = i === num - 1;
      const x = i % 2 === 0 ? width / 2 : width;
      const y = (i + 1) * spacing;

      const angle = Math.PI * 0.04 * (i % 2 === 0 ? 1 : -1);

      return Bodies.rectangle(x, y, isLast ? w : width, recHeight, {
        isStatic: true,
        label: "rect",
        angle: isLast ? 0 : angle,
        density: 0.001, // ボールを軽く設定
        friction: 0.01, // 転がり摩擦を低く設定
        frictionAir: 0.01, // 空気抵抗を低く設定
        restitution: 0.6, // 反発係数
      });
    });

    Composite.add(world, rects);
  }, []);

  const onResize = useCallback(() => {
    if (!render.current) return;
    if (!matterEngine.current) return;

    render.current.bounds.max.x = window.innerWidth;
    render.current.bounds.max.y = window.innerHeight;
    render.current.options.width = window.innerWidth;
    render.current.options.height = window.innerHeight;
    render.current.canvas.width = window.innerWidth;
    render.current.canvas.height = window.innerHeight;
    Matter.Render.setPixelRatio(render.current, window.devicePixelRatio);

    sizeRef.current = {
      w: window.innerWidth,
      h: window.innerHeight,
    };
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  useEffect(() => {
    if (!ref.current) return () => {};
    if (!state) return () => {};

    const { Engine, Runner } = Matter;

    matterEngine.current = matterEngine.current || Engine.create();
    const { world } = matterEngine.current;
    const { w, h } = sizeRef.current;

    render.current = Render.create({
      element: document.body,
      engine: matterEngine.current,
      options: {
        width: w,
        height: h,
        wireframes: true,
        background: "#000",
        pixelRatio: window.devicePixelRatio,
      },
    });

    if (!render.current) return () => {};

    Render.run(render.current);

    runner.current = Runner.create();

    Runner.run(runner.current, matterEngine.current);

    renderRectangles(world);
    renderWall(world, alignment.isLeft, alignment.isRight);

    Events.on(matterEngine.current, "afterUpdate", () => {
      // ボールの位置が画面外に出たら削除
      const balls = world.bodies.filter((body) => body.label === "ball");

      if (balls.length === 0) return;

      balls.forEach((ball) => {
        if (!ball.render.sprite) return;

        const { velocity } = ball;
        const ballDirection = velocity.x < 0 ? "left" : "right";

        const isOverX =
          ballDirection === "left" ? ball.position.x < 0 : ball.position.x > w;

        const isOverY = ball.position.y > h;

        if (isOverY) {
          Matter.Composite.remove(world, ball);

          return;
        }

        if (isOverX) {
          mutate({
            x: ball.position.x,
            id: slug,
            y: ball.position.y,
            direction: ball.position.x < 0 ? "left" : "right",
            data: { src: ball.render.sprite.texture },
          });
          Matter.Composite.remove(world, ball);
        }
      });
    });

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
  }, [
    alignment.isLeft,
    alignment.isRight,
    mutate,
    renderBall,
    renderRectangles,
    renderWall,
    slug,
    state,
  ]);

  return { ref, addBallHandler };
}
