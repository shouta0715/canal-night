import {
  Connection,
  Edge,
  Node,
  NodeChange,
  NodePositionChange,
  OnEdgesChange,
  OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import { atomWithReset } from "jotai/utils";
import { createStore } from "zustand";
import { UserSession } from "@/features/admin/types";
import { sessionToNode } from "@/features/admin/utils";

export const interactionAtom = atomWithReset<string | null>(null);

export type Mode = "view" | "connect";
export const EDGE_TYPE = "custom";

export type RFState = {
  // Node
  nodes: Node<UserSession>[];
  onNodesChange: OnNodesChange<Node<UserSession>>;
  setNodes: (cb: (nodes: Node<UserSession>[]) => Node<UserSession>[]) => void;
  onNodesPositionChange: (
    cb: (change: NodePositionChange, _: Node<UserSession>[]) => Promise<void>,
    changes: NodeChange<Node<UserSession>>[]
  ) => void;

  // Edge
  onEdgesChange: OnEdgesChange;
  edges: Edge[];
  onConnectEdge: (
    cb: (newEdge: Edge, newEdges: Edge[]) => Promise<void>,
    params: Connection
  ) => void;

  getNode: (id: string) => Node<UserSession> | undefined;
};

export const createNodeStore = (initialProps: UserSession[]) => {
  return createStore<RFState>()((set, get) => ({
    // Node
    nodes: sessionToNode(initialProps),
    onNodesChange: (changes: NodeChange<Node<UserSession>>[]) => {
      set((state) => ({
        nodes: applyNodeChanges<Node<UserSession>>(changes, state.nodes),
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

    // Edge
    edges: [],
    onEdgesChange: (changes) => {
      set((state) => ({
        edges: applyEdgeChanges(changes, state.edges),
      }));
    },
    onConnectEdge: async (cb, params) => {
      if (
        !params.source ||
        !params.target ||
        !params.sourceHandle ||
        !params.targetHandle
      )
        return;

      const sourceDirection = params.sourceHandle.split("-").at(-1);
      const targetDirection = params.targetHandle.split("-").at(-1);

      const id = `${params.source}+${params.target}-${sourceDirection}->${targetDirection}`;

      const alreadyConnected = get().edges.some((edge) => edge.id === id);

      if (alreadyConnected) return;

      const newEdge: Edge = {
        ...params,
        type: EDGE_TYPE,
        id,
        source: params.source,
        target: params.target,
      };

      const newEdges = addEdge(newEdge, get().edges);

      set(() => ({
        edges: newEdges,
      }));

      await cb(newEdge, newEdges);
    },
  }));
};

export type NodeStore = ReturnType<typeof createNodeStore>;
