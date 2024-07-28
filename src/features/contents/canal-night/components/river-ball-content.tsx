/* eslint-disable react/no-unused-prop-types */

"use client";

import React from "react";
import { Alignment } from "@/features/admin/types";

import {
  AppState,
  RiverBallData,
} from "@/features/contents/canal-night/api/use-canal-night-api";
import { useRiverBall } from "@/features/contents/canal-night/hooks/use-river-ball";

type RiverBallContentsProps = {
  data: RiverBallData;
  state?: AppState;
  alignment: Alignment;
};

export function RiverBallContents(props: RiverBallContentsProps) {
  const { ref } = useRiverBall(props);

  return (
    <div>
      <div ref={ref} />
    </div>
  );
}
