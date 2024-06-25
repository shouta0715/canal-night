"use client";

import React from "react";
import { useRipplesPingPong } from "@/features/ripples-ping-pong/hooks/use-ripples-ping-pong";

function RipplesPingPong({ id }: { id: string }) {
  const { canvasRef } = useRipplesPingPong({ id });

  return (
    <div>
      <div ref={canvasRef} className="[&>canvas]:border" />
    </div>
  );
}

export default RipplesPingPong;
