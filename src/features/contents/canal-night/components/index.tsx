"use client";

import { useParams } from "next/navigation";
import React from "react";
import { Alignment } from "@/features/admin/types";

import {
  AppState,
  useRiverBallAPI,
} from "@/features/contents/canal-night/api/use-canal-night-api";
import { CanalNight } from "@/features/contents/canal-night/components/canal-night";

const initialAlignment: Alignment = {
  isBottom: true,
  isTop: true,
  isLeft: true,
  isRight: true,
};

export default function RiverBall() {
  const params = useParams<{ slug: string }>();
  const [state, setState] = React.useState<AppState>();
  const [alignment, setAlignment] = React.useState<Alignment>(initialAlignment);

  const { lastJsonMessage } = useRiverBallAPI({
    appName: "canal-night",
    id: params.slug,
    cb: (data) => {
      if (data.action === "join") {
        setState(data.state);
        setAlignment(data.state.alignment);
      }

      if (data.action === "connection") {
        setAlignment(data.alignment);
      }

      if (data.action === "device") {
        setState(data);
      }
    },
  });

  return (
    <div>
      <CanalNight alignment={alignment} data={lastJsonMessage} state={state} />
    </div>
  );
}
