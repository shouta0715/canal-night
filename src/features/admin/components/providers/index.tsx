"use client";

import React, { createContext, useRef } from "react";
import { CustomsInput } from "@/features/admin/schema";
import { NodeStore, createNodeStore } from "@/features/admin/store";
import { UserSession } from "@/features/admin/types";

type RfProviderProps = {
  children: React.ReactNode;
  initialSession?: UserSession[];
  customs: CustomsInput;
};

const RFContext = createContext<NodeStore | null>(null);

export function NodeProvider({
  children,
  initialSession = [],
  customs = [],
}: RfProviderProps) {
  const store = useRef(createNodeStore(initialSession, customs)).current;

  return <RFContext.Provider value={store}>{children}</RFContext.Provider>;
}

export const useNodeStore = () => {
  const s = React.useContext(RFContext);

  if (!s) {
    throw new Error("useNodeStore must be used within a RfProvider");
  }

  return s;
};
