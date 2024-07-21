"use client";

import "@xyflow/react/dist/base.css";

import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  Panel,
  ConnectionMode,
} from "@xyflow/react";
import React from "react";

import { Rnd } from "react-rnd";
import { CustomSessionNode } from "@/features/admin/components/custom";
import { CustomEdge } from "@/features/admin/components/custom/edge";
import { AdminPanel } from "@/features/admin/components/panel";
import { EDGE_TYPE } from "@/features/admin/constant";
import { useAdmin } from "@/features/admin/hooks/use-admin";

const nodeTypes = { session: CustomSessionNode };
const edgeTypes = {
  [EDGE_TYPE]: CustomEdge,
};

export const AdminFlow = () => {
  const {
    nodes,
    onNodesChange,
    onNodeDragStart,
    edges,
    onEdgesChange,
    onConnect,
  } = useAdmin();

  return (
    <ReactFlow
      connectionMode={ConnectionMode.Loose}
      edges={edges}
      edgeTypes={edgeTypes}
      fitView
      minZoom={0.1}
      nodes={nodes}
      nodeTypes={nodeTypes}
      onConnect={onConnect}
      onEdgesChange={onEdgesChange}
      onNodeDragStart={onNodeDragStart}
      onNodesChange={onNodesChange}
    >
      <Panel
        className="h-full"
        position="top-left"
        style={{
          margin: "0",
        }}
      >
        <Rnd
          className="h-full border-r-2 bg-background"
          default={{
            x: 0,
            y: 0,
            width: 320,
            height: "100%",
          }}
          disableDragging
          maxWidth="90vw"
          minWidth={320}
        >
          <AdminPanel />
        </Rnd>
      </Panel>
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};
