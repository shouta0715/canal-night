"use client";

import React from "react";
import { ConnectMode } from "@/components/ConnectMode";
import { useRipples } from "@/features/contents/ripples/hooks/use-ripples";
import { ContentProps } from "@/types";

function Ripples(props: ContentProps) {
  const { canvasRef, mode } = useRipples(props);

  if (mode === "connect") return <ConnectMode />;

  return (
    <div>
      <div key={mode} ref={canvasRef} className="[&>canvas]:border" />
    </div>
  );
}

export default Ripples;
