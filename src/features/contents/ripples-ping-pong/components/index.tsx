"use client";

import React from "react";
import { useRipplesPingPong } from "@/features/contents/ripples-ping-pong/hooks/use-ripples-ping-pong";
import { ContentProps } from "@/types";

function RipplesPingPong(props: ContentProps) {
  const { canvasRef } = useRipplesPingPong(props);

  return (
    <div>
      <div ref={canvasRef} className="[&>canvas]:border" />
    </div>
  );
}

export default RipplesPingPong;
