import dynamic from "next/dynamic";
import React from "react";

const DynamicRipplesPingPong = dynamic(
  () => import("@/features/ripples-ping-pong/components"),
  {
    ssr: false,
  }
);

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <DynamicRipplesPingPong id={params.slug} />
    </div>
  );
}
