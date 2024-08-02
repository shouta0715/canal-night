import Matter, { Events, Render } from "matter-js";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { API_URL } from "@/constant";
import { Alignment } from "@/features/admin/types";
import {
  AppState,
  RiverBallData,
  useMutateOver,
} from "@/features/contents/canal-night/api/use-canal-night-api";

const IMAGE_URL = `${API_URL}/canal-night/images`;

type UseRiverBallProps = {
  data: RiverBallData | null;
  state?: AppState;
  alignment: Alignment;
};

const MAX_BALLS = 100;

export function useCanalNight({ data, state, alignment }: UseRiverBallProps) {
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
  const [fadeX, setFadeX] = useState<{
    x: number;
    timestamp: number;
  } | null>(null);

  const { mutate } = useMutateOver();
  const sendedBallListRef = useRef<string[]>([]);

  const getRandomVelocity = () => {
    const randomX = Math.random() * 20 - 10;
    const randomY = Math.random() * 2 * -1;

    return { x: randomX, y: randomY };
  };

  const renderBall = useCallback(
    (x: number, y: number, id?: string, randomSize?: number) => {
      // 150の画像が来る。
      const base = 150;
      // ボールの大きさは100pxにしたい

      // ボールのサイズを 80 ~ 120 の間でランダムにする
      const randomBallSize = randomSize || Math.random() * 40 + 80;

      const ballSize = randomBallSize * (state?.custom?.scale || 1);
      const scale = ballSize / base;

      const ball = Matter.Bodies.circle(x, y, ballSize, {
        restitution: 1.0,
        friction: 0,
        frictionAir: 0,
        render: {
          sprite: id
            ? {
                texture: `${IMAGE_URL}/${id}`,
                xScale: scale,
                yScale: scale,
              }
            : undefined,
        },
        label: `ball+${id}+${ballSize}`,
      });

      return ball;
    },
    [state?.custom?.scale]
  );

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

      const custom = state?.custom;

      const ld = Number(custom?.wall_distance_l) || 0;
      const rd = Number(custom?.wall_distance_r) || 0;
      const td = Number(custom?.wall_distance_t) || 0;
      const bd = Number(custom?.wall_distance_b) || 0;

      const left = Bodies.rectangle(20 - ld, h / 2, 40, h * 10, {
        isStatic: true,
        label: "wall",
        render: {
          fillStyle: "#000",
        },
      });

      const right = Bodies.rectangle(w - 20 + rd, h / 2, 40, h * 10, {
        isStatic: true,
        label: "wall",
        render: {
          fillStyle: "#000",
        },
      });

      const top = Bodies.rectangle(w / 2, 0 - td, w * 10, 40, {
        isStatic: true,
        label: "wall",
        render: {
          fillStyle: "#000",
        },
      });

      const bottom = Bodies.rectangle(w / 2, h + bd, w * 10, 40, {
        isStatic: true,
        label: "wall",
        render: {
          fillStyle: "#000",
        },
      });

      Composite.add(world, [
        ...(isLeft ? [left] : []),
        ...(isRight ? [right] : []),
        ...(isTop ? [top] : []),
        ...(isBottom ? [bottom] : []),
      ]);
    },
    [state?.custom]
  );

  const addBallHandler = useCallback(
    (
      x: number,
      y: number,
      id?: string,
      velocity?: { x: number; y: number },
      size?: number
    ) => {
      if (!matterEngine.current) return;
      const { world } = matterEngine.current;

      const ball = renderBall(x, y, id, size);

      matterEngine.current.gravity.y = 0;

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
      const bottom = Number(state?.custom?.wall_distance_b) || 0;
      const x = Math.random() * (window.innerWidth - 400) + 200;
      addBallHandler(x, window.innerHeight + bottom, data.id);
      const time = Date.now();

      setFadeX({ x, timestamp: time });
    }

    if (data.action === "over") {
      addBallHandler(
        data.x,
        data.y,
        data.data.src,
        data.data.velocity,
        data.data.size
      );
    }
  }, [addBallHandler, data, state?.custom?.wall_distance_b]);

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
    const { world } = matterEngine.current || {};

    if (!world) return;
    const timer = setInterval(() => {
      const balls = world.bodies.filter((body) => body.label.includes("ball"));

      balls.forEach((ball) => {
        const forceMagnitude = 0.02 * ball.mass;
        const force = {
          x: (Math.random() - 0.5) * forceMagnitude,
          y: (Math.random() - 0.5) * forceMagnitude,
        };

        Matter.Body.applyForce(ball, ball.position, force);
      });

      return () => clearInterval(timer);
    }, 1000);
  }, []);

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
        wireframes: false,
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
        const size = Number(ball.label.split("+")[2]);
        const { velocity } = ball;
        const balXlDirection = velocity.x < 0 ? "left" : "right";
        const ballYDirection = velocity.y < 0 ? "top" : "bottom";

        const custom = state?.custom;
        const ld = Number(custom?.wall_distance_l) || 0;
        const rd = Number(custom?.wall_distance_r) || 0;
        const td = Number(custom?.wall_distance_t) || 0;
        const bd = Number(custom?.wall_distance_b) || 0;

        const ballSize = size * (state?.custom?.scale || 1);

        const isOverX =
          balXlDirection === "left"
            ? ball.position.x - ballSize < 0
            : ball.position.x + ballSize > w;
        const isOverY =
          ballYDirection === "top"
            ? ball.position.y - ballSize < 0
            : ball.position.y + ballSize > h;

        const isSended = sendedBallListRef.current.includes(id);

        if (isOverX && !isSended && (!alignment.isLeft || !alignment.isRight)) {
          mutate({
            x: ball.position.x,
            y: ball.position.y,
            id: slug,
            data: { src: id, velocity, size: ballSize },
            direction: balXlDirection,
          });

          sendedBallListRef.current.push(id);
          Matter.Body.set(ball, {
            collisionFilter: { category: 0x0001, mask: 0x0000 },
          });
        }

        if (isOverY && !isSended && (!alignment.isTop || !alignment.isBottom)) {
          mutate({
            x: ball.position.x,
            y: ball.position.y,
            id: slug,
            data: { src: id, velocity, size: ballSize },
            direction: ballYDirection,
          });

          sendedBallListRef.current.push(id);
          Matter.Body.set(ball, {
            collisionFilter: { category: 0x0001, mask: 0x0000 },
          });
        }

        const isOverAll =
          balXlDirection === "left"
            ? ball.position.x + ballSize < 0 - ld
            : ball.position.x - ballSize > w + rd;

        const isOverAllY =
          ballYDirection === "top"
            ? ball.position.y + ballSize < 0 - td
            : ball.position.y - ballSize > h + bd;

        if (isOverAll || isOverAllY) {
          Matter.Composite.remove(world, ball);

          sendedBallListRef.current = sendedBallListRef.current.filter(
            (sendedId) => sendedId !== id
          );
        }
      });
    });

    const timer = setInterval(() => {
      const balls = world.bodies.filter((body) => body.label.includes("ball"));

      balls.forEach((ball) => {
        const forceMagnitude = 0.02 * ball.mass;
        const force = {
          x: (Math.random() - 0.5) * forceMagnitude,
          y: (Math.random() - 0.5) * forceMagnitude,
        };

        Matter.Body.applyForce(ball, ball.position, force);
      });
    }, 30000);

    return () => {
      clearInterval(timer);
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

  return { ref, addBallHandler, fadeX, setFadeX };
}
