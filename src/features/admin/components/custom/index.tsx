import { Handle, Node, NodeProps, NodeResizer, Position } from "@xyflow/react";
import React, { memo } from "react";

import { useCustomNode } from "@/features/admin/hooks/use-custom-node";
import { UserSession } from "@/features/admin/types";
import { cn } from "@/lib/utils";

const positions: Position[] = [
  Position.Left,
  Position.Top,
  Position.Right,
  Position.Bottom,
];

function CustomSession({
  data,
  id,
  isConnectable,
}: NodeProps<Node<UserSession>>) {
  const {
    inputSize,
    interactionId,
    node,
    setInputSize,
    onResizeEnd,
    mode,
    displayname,
  } = useCustomNode({ data, id });

  return (
    <div
      className="relative bg-white/80"
      style={{
        width: inputSize.width,
        height: inputSize.height,
      }}
    >
      {positions.map((position) => (
        <Handle
          key={position}
          className="rounded-full"
          id={`${id}-${position}`}
          isConnectable={isConnectable}
          position={position}
          style={{
            width: 24,
            height: 24,
            zIndex: 9999,
            top: position === Position.Top ? -60 : undefined,
            bottom: position === Position.Bottom ? -60 : undefined,
            left: position === Position.Left ? -60 : undefined,
            right: position === Position.Right ? -60 : undefined,
          }}
          type="source"
        />
      ))}

      <NodeResizer
        handleStyle={{
          backgroundColor: "black",
          width: 16,
          height: 16,
          zIndex: 9999,
        }}
        isVisible={node === id}
        lineStyle={{
          borderWidth: 4,
          borderColor:
            mode === "connect" ? "rgb(34 197 94)" : "rgb(59 130 246)",
        }}
        minHeight={300}
        minWidth={300}
        onResize={(_, s) => {
          setInputSize({
            width: s.width,
            height: s.height,
          });
        }}
        onResizeEnd={onResizeEnd}
      />

      <div
        className={cn(
          "size-full p-10",
          id === node ? "" : "border-4 border-primary",
          interactionId === id ? "border-4 border-yellow-500" : ""
        )}
      >
        <p className="flex h-full items-center justify-center text-4xl font-bold">
          {data.alignment.isTop ? "👆" : ""}
          {data.alignment.isLeft ? "👈" : ""}
          {displayname}
          {data.alignment.isRight ? "👉" : ""}
          {data.alignment.isBottom ? "👇" : ""}
        </p>
      </div>
    </div>
  );
}

export const CustomSessionNode = memo(CustomSession);
