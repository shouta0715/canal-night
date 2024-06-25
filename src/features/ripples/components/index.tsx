"use client";

import React from "react";
import { useRipples } from "@/features/ripples/hooks/use-ripples";

function Ripples({ id }: { id: string }) {
  const { canvasRef } = useRipples({ id });

  return (
    <div>
      <div ref={canvasRef} className="[&>canvas]:border" />
    </div>
  );
}

export default Ripples;
