/* eslint-disable @next/next/no-img-element */

"use client";

import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import React, { useRef } from "react";
import { API_URL } from "@/constant";

type SushiProps = {
  sushi: { id: string; x: number };
  onAnimationComplete: (id: string) => void;
  onOverWindow?: (id: string, position: number) => void;
};

export const Sushi = ({
  sushi,
  onAnimationComplete,
  onOverWindow,
}: SushiProps) => {
  const x = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);
  const once = useRef(false);

  useMotionValueEvent(x, "change", (latest) => {
    if (!ref.current || once.current) return;
    const isOver = latest > window.innerWidth - ref.current.offsetWidth;

    if (!isOver) return;

    once.current = true;
    onOverWindow?.(sushi.id, latest);
  });

  return (
    <motion.div
      ref={ref}
      animate={{
        x: window.innerWidth,
      }}
      className="absolute -top-1/2 z-20 size-60 rounded-full"
      initial={{
        x: sushi.x,
      }}
      onAnimationComplete={() => {
        onAnimationComplete(sushi.id);
      }}
      style={{
        x,
      }}
      transition={{
        duration: 10,
        ease: "linear",
      }}
    >
      <div className="relative size-full">
        <img
          alt="寿司"
          className="absolute size-full"
          src={`${API_URL}/conveyor-belt-sushi/images/${sushi.id}`}
        />
      </div>
    </motion.div>
  );
};
