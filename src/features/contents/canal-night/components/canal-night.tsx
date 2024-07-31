/* eslint-disable react/no-unused-prop-types */

"use client";

import { motion } from "framer-motion";
import React from "react";
import { Alignment } from "@/features/admin/types";

import {
  AppState,
  RiverBallData,
} from "@/features/contents/canal-night/api/use-canal-night-api";
import { useCanalNight } from "@/features/contents/canal-night/hooks/use-canal-night";

type RiverBallContentsProps = {
  data: RiverBallData;
  state?: AppState;
  alignment: Alignment;
};

export function CanalNight({ state, ...props }: RiverBallContentsProps) {
  const { ref, fadeX, setFadeX } = useCanalNight({ ...props, state });

  return (
    <div>
      {state?.isStartDevice && fadeX && (
        <motion.div
          key={fadeX.timestamp}
          animate={{
            opacity: [0, 1, 0],
          }}
          className="absolute bottom-0 "
          onAnimationEnd={() => {
            setFadeX(null);
          }}
          style={{
            x: fadeX.x - 100,
          }}
          transition={{
            times: [0, 0.25, 1],
            duration: 2,
          }}
        >
          <div className="size-[300px] bg-gradient-to-t from-white/80 via-white/30 to-transparent" />
        </motion.div>
      )}

      <div ref={ref} />
    </div>
  );
}
