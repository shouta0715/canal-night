"use client";

import "reactflow/dist/style.css";

import React from "react";

import ReactFlow, { Controls, Background, MiniMap, Node } from "reactflow";
import { CustomSessionNode } from "@/features/admin/components/custom";
import { useAdmin } from "@/features/admin/hooks/use-admin";
import { AdminNode } from "@/features/admin/types";

const nodeTypes = { session: CustomSessionNode };

export const AdminFlow = ({
  initialNodes,
}: {
  initialNodes: Node<AdminNode>[];
}) => {
  const { nodes, onNodesChange } = useAdmin({ initialNodes });

  return (
    <ReactFlow
      fitView
      minZoom={0.1}
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};
