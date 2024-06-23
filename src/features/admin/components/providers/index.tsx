"use client";

import React, { createContext, useRef } from "react";
import { NodeStore, createNodeStore } from "@/features/admin/store";
import { UserSession } from "@/features/admin/types";

type RfProviderProps = {
  children: React.ReactNode;
  initialSession?: UserSession[];
};

const RFContext = createContext<NodeStore | null>(null);

export function NodeProvider({
  children,
  initialSession = [],
}: RfProviderProps) {
  const store = useRef(createNodeStore(initialSession)).current;

  return <RFContext.Provider value={store}>{children}</RFContext.Provider>;
}

export const useNodeStore = () => {
  const s = React.useContext(RFContext);

  if (!s) {
    throw new Error("useNodeStore must be used within a RfProvider");
  }

  return s;
};
