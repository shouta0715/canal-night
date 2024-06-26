import dynamic from "next/dynamic";
import React from "react";
import { getInitialMode } from "@/utils";

const DynamicRipplesPingPong = dynamic(
  () => import("@/features/contents/ripples-ping-pong/components"),
  {
    ssr: false,
  }
);

export default async function Page({ params }: { params: { slug: string } }) {
  const { mode } = await getInitialMode("ripples-ping-pong");

  return (
    <div>
      <DynamicRipplesPingPong id={params.slug} initialMode={mode} />
    </div>
  );
}
