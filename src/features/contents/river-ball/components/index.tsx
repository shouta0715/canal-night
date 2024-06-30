"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRiverBall } from "@/features/contents/river-ball/hooks/use-river-ball";

function RiverBall() {
  const { ref, addBallHandler } = useRiverBall();

  return (
    <div className="relative">
      <Button
        className="absolute left-1/2 top-10 -translate-x-1/2"
        onClick={addBallHandler}
        variant="outline"
      >
        ボールを追加
      </Button>
      <div ref={ref} />
    </div>
  );
}

export default RiverBall;
