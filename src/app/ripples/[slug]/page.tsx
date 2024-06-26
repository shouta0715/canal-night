import dynamic from "next/dynamic";
import React from "react";
import { getInitialMode } from "@/utils";

const DynamicRipples = dynamic(
  () => import("@/features/contents/ripples/components"),
  {
    ssr: false,
  }
);
export default async function Page({ params }: { params: { slug: string } }) {
  const { mode } = await getInitialMode("ripples");
  console.log("mode", mode);

  return (
    <div>
      <DynamicRipples id={params.slug} initialMode={mode} />
    </div>
  );
}
