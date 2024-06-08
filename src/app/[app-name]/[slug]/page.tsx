import dynamic from "next/dynamic";
import React from "react";

const DynamicRipples = dynamic(() => import("@/components/ripples"), {
  ssr: false,
});

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
      <DynamicRipples id={params.slug} />
    </div>
  );
}
