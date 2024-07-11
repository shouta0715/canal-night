"use client";

import React from "react";
import { ConnectMode } from "@/components/connect-mode";
import { Rail } from "@/features/contents/conveyor-belt-sushi/components/rail";
import { Sushi } from "@/features/contents/conveyor-belt-sushi/components/sushi";
import { useConveyorBeltSushi } from "@/features/contents/conveyor-belt-sushi/hooks";
import { ContentProps } from "@/types";

function ConveyorBeltSushi({ id, initialMode }: ContentProps) {
  const { isConnecting, mode, sushi, onAnimateComplete, onOverWindow } =
    useConveyorBeltSushi({
      initialMode,
      id,
    });
  if (mode === "connect") {
    return (
      <ConnectMode
        appName="conveyor-belt-sushi"
        id={id}
        isConnecting={isConnecting}
      />
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="relative mt-auto">
        {sushi.map((sushiId) => {
          return (
            <Sushi
              key={sushiId.id}
              onAnimationComplete={onAnimateComplete}
              onOverWindow={onOverWindow}
              sushi={{ id: sushiId.id, x: sushiId.x, dish: sushiId.dish }}
            />
          );
        })}
        <Rail />
      </div>
    </div>
  );
}

export default ConveyorBeltSushi;
