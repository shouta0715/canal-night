"use client";

import React from "react";
import { useP5 } from "@/hooks/ripples/use-p5";

function Ripples({ id }: { id: string }) {
  const { canvasRef } = useP5({ id });

  return (
    <div>
      <div ref={canvasRef} className="[&>canvas]:border" />
    </div>
  );
}

export default Ripples;
