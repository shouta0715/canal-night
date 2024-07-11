"use client";

import React from "react";
import { ConnectMode } from "@/components/connect-mode";
import { useRipplesPingPong } from "@/features/contents/ripples-ping-pong/hooks/use-ripples-ping-pong";
import { ContentProps } from "@/types";

function RipplesPingPong({ id, ...rest }: ContentProps) {
  const { canvasRef, isConnecting, mode } = useRipplesPingPong({ id, ...rest });

  if (mode === "connect")
    return (
      <ConnectMode
        appName="ripples-ping-pong"
        id={id}
        isConnecting={isConnecting}
      />
    );

  return (
    <div>
      <div ref={canvasRef} className="[&>canvas]:border" />
    </div>
  );
}

export default RipplesPingPong;
