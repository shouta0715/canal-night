"use client";

import { useParams } from "next/navigation";
import React from "react";
import { useRiverBallAPI } from "@/features/contents/river-ball/api/use-river-ball-api";
import { RiverBallContents } from "@/features/contents/river-ball/components/river-ball-content";

export default function RiverBall() {
  const params = useParams<{ slug: string }>();
  const { lastJsonMessage } = useRiverBallAPI({
    appName: "river-ball",
    id: params.slug,
    cb: () => {},
  });

  return (
    <div>
      <RiverBallContents data={lastJsonMessage} />
    </div>
  );
}
