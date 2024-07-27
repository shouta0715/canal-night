/* eslint-disable react/no-unused-prop-types */

"use client";

import React from "react";
import { Alignment } from "@/features/admin/types";

import { RiverBallData } from "@/features/contents/canal-night/api/use-canal-night-api";
import { useRiverBall } from "@/features/contents/canal-night/hooks/use-river-ball";
import { UserState } from "@/types";

type RiverBallContentsProps = {
  data: RiverBallData;
  state?: UserState;
  alignment: Alignment;
  alignmentStates: { left: UserState | null; right: UserState | null };
};

export function RiverBallContents(props: RiverBallContentsProps) {
  const { ref } = useRiverBall(props);

  return (
    <div>
      <div ref={ref} />
    </div>
  );
}
