import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  CustomMarkers,
  getMarkerId,
  getStrokeColor,
} from "@/features/admin/components/custom/markers";
import { useNodeStore } from "@/features/admin/components/providers";
import { Mode, RFState } from "@/features/admin/store";

export type GetSpecialPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY }: GetSpecialPathParams,
  offset: number
) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX} ${
    centerY + offset
  } ${targetX} ${targetY}`;
};

const selector = (state: RFState) => ({ edges: state.edges });

export function CustomEdge({
  id,
  source,
  selected,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const store = useNodeStore();
  const { edges } = useStore(store, useShallow(selector));

  const searchParams = useSearchParams();
  const node = searchParams.get("node") || "";
  const mode = (searchParams.get("mode") || "view") as Mode;

  const isBiDirectionEdge = useMemo(() => {
    const edgeExists = edges.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target)
    );

    return edgeExists;
  }, [edges, source, target]);

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  let path = "";

  if (isBiDirectionEdge) {
    path = getSpecialPath(edgePathParams, sourceX < targetX ? 250 : -250);
  } else {
    [path] = getBezierPath(edgePathParams);
  }

  const markerEndId = getMarkerId({
    node,
    source,
    mode,
    selected,
  });

  return (
    <>
      <CustomMarkers />
      <BaseEdge
        key={id}
        markerEnd={`url(#${markerEndId})`}
        path={path}
        style={{
          strokeWidth: 4,
          stroke: getStrokeColor({ node, source, mode, selected }),
          strokeDasharray: "20, 20",
        }}
      />
    </>
  );
}
