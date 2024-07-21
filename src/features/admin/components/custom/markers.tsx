import React, { memo } from "react";
import { Mode } from "@/features/admin/store";

type MarkerType = "connect" | "view" | "normal" | "selected";
type MarkerId =
  | "custom-marker-connect"
  | "custom-marker-view"
  | "custom-marker-normal"
  | "custom-marker-selected";

const markers: Record<MarkerType, MarkerId> = {
  connect: "custom-marker-connect",
  view: "custom-marker-view",
  normal: "custom-marker-normal",
  selected: "custom-marker-selected",
} as const;

type MarkerProps = {
  node: string;
  source: string;
  mode: Mode;
  selected?: boolean;
};

export const getStrokeColor = ({
  node,
  source,
  mode,
  selected,
}: MarkerProps) => {
  const isActivated = node === source;

  if (!isActivated) {
    return selected ? "black" : "gray";
  }

  return mode === "connect" ? "rgb(34 197 94)" : "rgb(59 130 246)";
};

export const getMarkerId = ({
  node,
  source,
  mode,
  selected,
}: MarkerProps): MarkerId => {
  const isActivated = node === source;

  if (!isActivated) {
    return selected ? markers.selected : markers.normal;
  }

  return markers[mode];
};

function Markers() {
  return (
    <>
      <svg>
        <defs>
          <marker
            id={markers.connect}
            markerHeight="20"
            markerUnits="strokeWidth"
            markerWidth="20"
            orient="auto"
            refX="10"
            refY="5"
          >
            <path
              d="M0,0 L0,10 L10,5 z"
              fill={getStrokeColor({
                node: "",
                source: "",
                mode: "connect",
                selected: true,
              })}
            />
          </marker>
        </defs>
      </svg>

      <svg>
        <defs>
          <marker
            id={markers.view}
            markerHeight="20"
            markerUnits="strokeWidth"
            markerWidth="20"
            orient="auto"
            refX="10"
            refY="5"
          >
            <path
              d="M0,0 L0,10 L10,5 z"
              fill={getStrokeColor({
                node: "",
                source: "",
                mode: "view",
                selected: true,
              })}
            />
          </marker>
        </defs>
      </svg>

      <svg>
        <defs>
          <marker
            id={markers.normal}
            markerHeight="20"
            markerUnits="strokeWidth"
            markerWidth="20"
            orient="auto"
            refX="10"
            refY="5"
          >
            <path
              d="M0,0 L0,10 L10,5 z"
              fill={getStrokeColor({
                node: "none",
                source: "",
                mode: "view",
                selected: false,
              })}
            />
          </marker>
        </defs>
      </svg>

      <svg>
        <defs>
          <marker
            id={markers.selected}
            markerHeight="20"
            markerUnits="strokeWidth"
            markerWidth="20"
            orient="auto"
            refX="10"
            refY="5"
          >
            <path
              d="M0,0 L0,10 L10,5 z"
              fill={getStrokeColor({
                node: "none",
                source: "",
                mode: "view",
                selected: true,
              })}
            />
          </marker>
        </defs>
      </svg>
    </>
  );
}

export const CustomMarkers = memo(Markers);
