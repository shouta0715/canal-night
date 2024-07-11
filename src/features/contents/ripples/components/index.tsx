"use client";

import React from "react";
import { ConnectMode } from "@/components/connect-mode";
import { useRipples } from "@/features/contents/ripples/hooks/use-ripples";
import { ContentProps } from "@/types";

function Ripples({ id, ...rest }: ContentProps) {
  const { canvasRef, mode, isConnecting } = useRipples({ id, ...rest });

  if (mode === "connect")
    return (
      <ConnectMode appName="ripples" id={id} isConnecting={isConnecting} />
    );

  return (
    <div>
      <div key={mode} ref={canvasRef} className="[&>canvas]:border" />
    </div>
  );
}

export default Ripples;
