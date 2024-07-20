"use client";

import "reactflow/dist/style.css";

import React from "react";

import { Rnd } from "react-rnd";
import ReactFlow, { Controls, Background, MiniMap, Panel } from "reactflow";
import { CustomSessionNode } from "@/features/admin/components/custom";
import { AdminPanel } from "@/features/admin/components/panel";
import { useAdmin } from "@/features/admin/hooks/use-admin";

const nodeTypes = { session: CustomSessionNode };

export const AdminFlow = () => {
  const { nodes, onNodesChange, onNodeDragStart } = useAdmin();

  return (
    <ReactFlow
      fitView
      minZoom={0.1}
      nodes={nodes}
      nodeTypes={nodeTypes}
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
