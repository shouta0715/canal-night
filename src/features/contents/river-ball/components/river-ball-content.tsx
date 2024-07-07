"use client";

import React from "react";
import { RiverBallData } from "@/features/contents/river-ball/api/use-river-ball-api";
import { useRiverBall } from "@/features/contents/river-ball/hooks/use-river-ball";

type RiverBallContentsProps = {
  data: RiverBallData;
};
export function RiverBallContents({ data }: RiverBallContentsProps) {
  const { ref } = useRiverBall({ data });

  return (
    <div>
      <div ref={ref} />
    </div>
  );
}
