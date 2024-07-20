import React from "react";
import { NodeProps, NodeResizer } from "reactflow";

import { useCustomNode } from "@/features/admin/hooks/use-custom-node";
import { UserSession } from "@/features/admin/types";
import { cn } from "@/lib/utils";

export function CustomSessionNode({ data, id }: NodeProps<UserSession>) {
  const {
    inputSize,
    interactionId,
    node,
    setInputSize,
    onResizeEnd,
    mode,
    alignment,
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
      <NodeResizer
        handleStyle={{
          backgroundColor: "black",
          width: 16,
          height: 16,
          zIndex: 9999,
          borderRadius: 4,
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
          {alignment.isLeft && "👈"}
          {displayname}
          {alignment.isRight && "👉"}
        </p>
      </div>
    </div>
  );
}
