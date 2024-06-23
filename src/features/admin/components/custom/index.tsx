import { useSearchParams } from "next/navigation";
import React from "react";
import { NodeProps } from "reactflow";
import { Monitor } from "@/features/admin/components/devices/monitor";
import { SmartPhone } from "@/features/admin/components/devices/smartphone";
import { Tablet } from "@/features/admin/components/devices/tablet";
import { AdminNode } from "@/features/admin/types";

// TODO:割る数を変更する
const DIVISION_FACTOR = 1;

const division = (value: number | undefined | null): number | null => {
  if (!value) return null;

  return value / DIVISION_FACTOR;
};

const devices = {
  mobile: SmartPhone,
  tablet: Tablet,
  monitor: Monitor,
};

const getDevice = (width: number | undefined | null): keyof typeof devices => {
  if (!width) return "mobile";

  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";

  return "monitor";
};

export function CustomSessionNode({ data, id }: NodeProps<AdminNode>) {
  const searchParams = useSearchParams();
  const node = searchParams.get("node") || "";
  const { width, height } = data;

  const Comp = devices[getDevice(width)];

  return (
    <div
      style={{
        width: division(width) || 100,
        height: division(height) || 100,
      }}
    >
      <Comp active={node === id} id={id}>
        {id}
      </Comp>
    </div>
  );
}
