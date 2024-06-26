import { atomWithReset } from "jotai/utils";
import {
  Node,
  NodeChange,
  NodePositionChange,
  OnNodesChange,
  applyNodeChanges,
} from "reactflow";
import { createStore } from "zustand";
import { UserSession } from "@/features/admin/types";
import { sessionToNode } from "@/features/admin/utils";

export const interactionAtom = atomWithReset<string | null>(null);

export type Mode = "view" | "connect";

export type RFState = {
  nodes: Node<UserSession>[];
  onNodesChange: OnNodesChange;
  setNodes: (cb: (nodes: Node<UserSession>[]) => Node<UserSession>[]) => void;
  onNodesPositionChange: (
    cb: (change: NodePositionChange, _: Node<UserSession>[]) => Promise<void>,
    changes: NodeChange[]
  ) => void;

  getNode: (id: string) => Node<UserSession> | undefined;
};

export const createNodeStore = (initialProps: UserSession[]) => {
  return createStore<RFState>()((set, get) => ({
    nodes: sessionToNode(initialProps),
    onNodesChange: (changes: NodeChange[]) => {
      set((state) => ({
        nodes: applyNodeChanges(changes, state.nodes),
      }));
    },
    setNodes: (cb) => {
      set((state) => {
        const newNodes = cb(state.nodes);

        return {
          nodes: newNodes,
        };
      });
    },
    onNodesPositionChange: async (cb, changes) => {
      const ch = changes[0];
      const { nodes } = get();

      if (ch.type === "position") cb(ch, nodes);

      set((state) => ({
        nodes: applyNodeChanges(changes, state.nodes),
      }));
    },
    getNode: (id) => {
      const { nodes } = get();

      return nodes.find((node) => node.id === id);
    },
  }));
};

export type NodeStore = ReturnType<typeof createNodeStore>;
