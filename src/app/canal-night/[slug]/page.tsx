import dynamic from "next/dynamic";
import React from "react";

const DynamicRiverBall = dynamic(
  () => import("@/features/contents/canal-night/components"),
  {
    ssr: false,
  }
);

export default function Page() {
  return (
    <div>
      <DynamicRiverBall />
    </div>
  );
}
