"use client";

import React, { createContext, useRef } from "react";
import { Node } from "reactflow";
import { NodeStore, createNodeStore } from "@/features/admin/store";
import { AdminNode } from "@/features/admin/types";

type RfProviderProps = {
  children: React.ReactNode;
  initialNodes?: Node<AdminNode>[];
};

const RFContext = createContext<NodeStore | null>(null);

export function NodeProvider({ children, initialNodes = [] }: RfProviderProps) {
  const store = useRef(createNodeStore(initialNodes)).current;

  return <RFContext.Provider value={store}>{children}</RFContext.Provider>;
}

export const useNodeStore = () => {
  const s = React.useContext(RFContext);

  if (!s) {
    throw new Error("useNodeStore must be used within a RfProvider");
  }

  return s;
};
