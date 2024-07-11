import dynamic from "next/dynamic";
import React from "react";
import { getInitialMode } from "@/utils";

const DynamicConveyorBeltSushi = dynamic(
  () => import("@/features/contents/conveyor-belt-sushi/components"),
  {
    ssr: false,
  }
);

export default async function Page({ params }: { params: { slug: string } }) {
  const { mode } = await getInitialMode("conveyor-belt-sushi");

  return (
    <div>
      <DynamicConveyorBeltSushi id={params.slug} initialMode={mode} />
    </div>
  );
}
