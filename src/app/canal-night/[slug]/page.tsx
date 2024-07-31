import dynamic from "next/dynamic";
import React from "react";

const DynamicCanalNight = dynamic(
  () => import("@/features/contents/canal-night/components"),
  {
    ssr: false,
  }
);

export default function Page() {
  return (
    <div>
      <DynamicCanalNight />
    </div>
  );
}
