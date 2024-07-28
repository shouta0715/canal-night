import Matter, { Events, Render } from "matter-js";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { Alignment } from "@/features/admin/types";
import {
  RiverBallData,
  useMutateOver,
} from "@/features/contents/canal-night/api/use-canal-night-api";
import { UserState } from "@/types";

const IMAGE_URL = "http://localhost:8787/canal-night/images";

type UseRiverBallProps = {
  data: RiverBallData | null;
  state?: UserState;
  alignment: Alignment;
};

const MAX_BALLS = 10;

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
  const ballListRef = useRef<Matter.Body[]>([]);

  const { mutate } = useMutateOver();
  const sendedBallListRef = useRef<string[]>([]);

  const getRandomVelocity = () => {
    const randomX = Math.random() * 20 - 10;
    const randomY = Math.random() + 1;

    return { x: randomX, y: randomY };
  };

  const renderBall = useCallback((x: number, y: number, id?: string) => {
    const scale = id ? 0.35 : 1;
    const ball = Matter.Bodies.circle(x, y, 100, {
      restitution: 1.0, // 弾性係数を1.0に設定
      friction: 0, // 摩擦を0に設定
      frictionAir: 0, // 空気抵抗を0に設定
      render: {
        sprite: id
          ? {
              texture: `${IMAGE_URL}/${id}`,
              xScale: scale,
              yScale: scale,
            }
          : undefined,
      },
      label: `ball+${id}`,
    });

    return ball;
  }, []);

  const renderWall = useCallback(
    (
      world: Matter.World,
      isLeft: boolean,
      isRight: boolean,
      isTop: boolean,
      isBottom: boolean
    ) => {
      const { Bodies, Composite } = Matter;
      const { w, h } = sizeRef.current;

      const left = Bodies.rectangle(20, h / 2, 40, h * 10, {
        isStatic: true,
        label: "wall",
        render: {
          strokeStyle: "#fff",
        },
      });
      const right = Bodies.rectangle(w - 20, h / 2, 40, h * 10, {
        isStatic: true,
        label: "wall",
        render: {
          strokeStyle: "#fff",
        },
      });

      const top = Bodies.rectangle(w / 2, 0, w, 5, {
        isStatic: true,
        label: "wall",
        render: {
          strokeStyle: "#fff",
        },
      });

      const bottom = Bodies.rectangle(w / 2, h, w, 5, {
        isStatic: true,
        label: "wall",
        render: {
          strokeStyle: "#fff",
        },
      });

      Composite.add(world, [
        ...(isLeft ? [left] : []),
        ...(isRight ? [right] : []),
        ...(isTop ? [top] : []),
        ...(isBottom ? [bottom] : []),
      ]);
    },
    []
  );

  const addBallHandler = useCallback(
    (
      x: number,
      y: number,
      id?: string,
      velocity?: { x: number; y: number }
    ) => {
      if (!matterEngine.current) return;
      const { world } = matterEngine.current;

      const ball = renderBall(x, y, id);

      matterEngine.current.gravity.y = 0.1;

      Matter.Composite.add(world, ball);

      const initialVelocity = velocity || getRandomVelocity();
      Matter.Body.setVelocity(ball, initialVelocity);

      ballListRef.current.push(ball);

      if (ballListRef.current.length > MAX_BALLS) {
        const oldestBall = ballListRef.current.shift();
        if (!oldestBall) return;
        Matter.Composite.remove(world, oldestBall);
      }
    },
    [renderBall]
  );

  useEffect(() => {
    if (!data) return;

    if (data.action === "uploaded") {
      const x = Math.random() * (window.innerWidth - 400) + 200;
      addBallHandler(x, 100, data.id);
    }

    if (data.action === "over") {
      // 壁より外側にあるかどうかを判定

      addBallHandler(data.x, data.y, data.data.src, data.data.velocity);
    }
  }, [addBallHandler, data]);

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
      },
    });

    if (!render.current) return () => {};

    Render.run(render.current);

    runner.current = Runner.create();

    Runner.run(runner.current, matterEngine.current);

    renderWall(
      world,
      alignment.isLeft,
      alignment.isRight,
      alignment.isTop,
      alignment.isBottom
    );

    Events.on(matterEngine.current, "afterUpdate", () => {
      const balls = world.bodies.filter((body) => body.label.includes("ball"));

      if (balls.length === 0) return;

      balls.forEach((ball) => {
        const id = ball.label.split("+")[1];
        const { velocity } = ball;
        const balXlDirection = velocity.x < 0 ? "left" : "right";
        const ballYDirection = velocity.y < 0 ? "top" : "bottom";

        const isOverX =
          balXlDirection === "left"
            ? ball.position.x - 50 < 0
            : ball.position.x + 50 > w;
        const isOverY =
          ballYDirection === "top"
            ? ball.position.y - 50 < 0
            : ball.position.y + 50 > h;

        const isSended = sendedBallListRef.current.includes(id);

        if (isOverX && !isSended && (!alignment.isLeft || !alignment.isRight)) {
          mutate({
            x: ball.position.x,
            y: ball.position.y,
            id: slug,
            data: { src: id, velocity },
            direction: balXlDirection,
          });

          sendedBallListRef.current.push(id);
        }

        if (isOverY && !isSended && (!alignment.isTop || !alignment.isBottom)) {
          mutate({
            x: ball.position.x,
            y: ball.position.y,
            id: slug,
            data: { src: id, velocity },
            direction: ballYDirection,
          });

          sendedBallListRef.current.push(id);
        }

        const isOverAll =
          balXlDirection === "left"
            ? ball.position.x + 100 < 0
            : ball.position.x - 100 > w;

        const isOverAllY =
          ballYDirection === "top"
            ? ball.position.y + 100 < 0
            : ball.position.y - 100 > h;

        if (isOverAll || isOverAllY) {
          Matter.Composite.remove(world, ball);

          sendedBallListRef.current = sendedBallListRef.current.filter(
            (sendedId) => sendedId !== id
          );
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
    alignment,
    alignment.isLeft,
    alignment.isRight,
    mutate,
    renderBall,
    renderWall,
    slug,
    state,
  ]);

  return { ref, addBallHandler };
}
