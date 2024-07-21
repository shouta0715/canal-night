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
import { EDGE_TYPE } from "@/features/admin/constant";
import { EdgeData, UserSession } from "@/features/admin/types";
import {
  createEdgeId,
  getEdgeDirection,
  sessionToEdge,
  sessionToNode,
} from "@/features/admin/utils";

export const interactionAtom = atomWithReset<string | null>(null);

export type Mode = "view" | "connect";

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
  onEdgesChange: OnEdgesChange<Edge<EdgeData>>;
  edges: Edge<EdgeData>[];
  onConnectEdge: (
    cb: (newEdge: Edge<EdgeData>, newEdges: Edge<EdgeData>[]) => Promise<void>,
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
    edges: sessionToEdge(initialProps),
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

      const splitSourceDirection = params.sourceHandle.split("-").at(-1);
      const splitTargetDirection = params.targetHandle.split("-").at(-1);
      if (!splitSourceDirection || !splitTargetDirection) return;

      const sourceDirection = getEdgeDirection(splitSourceDirection);
      const targetDirection = getEdgeDirection(splitTargetDirection);

      const id = createEdgeId({
        source: params.source,
        target: params.target,
        from: sourceDirection,
        to: targetDirection,
      });

      const alreadyConnected = get().edges.some((edge) => edge.id === id);

      if (alreadyConnected) return;

      const newEdge: Edge<EdgeData> = {
        ...params,
        type: EDGE_TYPE,
        id,
        source: params.source,
        target: params.target,
        targetHandle: params.targetHandle,
        sourceHandle: params.sourceHandle,
        data: {
          from: sourceDirection,
          to: targetDirection,
          source: params.source,
          target: params.target,
        },
      };

      const newEdges = addEdge<Edge<EdgeData>>(newEdge, get().edges);

      set(() => ({
        edges: newEdges,
      }));

      await cb(newEdge, newEdges);
    },
  }));
};

export type NodeStore = ReturnType<typeof createNodeStore>;
