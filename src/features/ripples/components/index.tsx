"use client";

import React from "react";
import { useP5 } from "@/features/ripples/hooks/use-p5";

function Ripples({ id }: { id: string }) {
  const { canvasRef } = useP5({ id });

  return (
    <div>
      <div ref={canvasRef} className="[&>canvas]:border" />
    </div>
  );
}

export default Ripples;
