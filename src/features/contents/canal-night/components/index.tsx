"use client";

import { useParams } from "next/navigation";
import React from "react";
import { Alignment } from "@/features/admin/types";

import { useRiverBallAPI } from "@/features/contents/canal-night/api/use-canal-night-api";
import { RiverBallContents } from "@/features/contents/canal-night/components/river-ball-content";
import { UserState } from "@/types";

const initialAlignment: Alignment = {
  isBottom: true,
  isTop: true,
  isLeft: true,
  isRight: true,
};

export default function RiverBall() {
  const params = useParams<{ slug: string }>();
  const [state, setState] = React.useState<UserState>();
  const [alignment, setAlignment] = React.useState<Alignment>(initialAlignment);
  const [alignmentStates, setAlignmentStates] = React.useState<{
    left: UserState | null;
    right: UserState | null;
  }>({
    left: null,
    right: null,
  });
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

        setAlignmentStates({
          left: data.alignment.isLeft ? null : data.sourceState,
          right: data.alignment.isRight ? null : data.sourceState,
        });
      }
    },
  });

  return (
    <div>
      <RiverBallContents
        alignment={alignment}
        alignmentStates={alignmentStates}
        data={lastJsonMessage}
        state={state}
      />
    </div>
  );
}
