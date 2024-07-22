import {
  Edge,
  Node,
  NodeChange,
  NodeMouseHandler,
  NodePositionChange,
  OnConnect,
  OnEdgesDelete,
  OnNodeDrag,
} from "@xyflow/react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useAdminAPI } from "@/features/admin/api/use-admin-api";
import { useNodeStore } from "@/features/admin/components/providers";
import { RFState } from "@/features/admin/store";
import { EdgeData, UserSession } from "@/features/admin/types";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
  onNodesChange: state.onNodesChange,
  onNodesPositionChange: state.onNodesPositionChange,
  edges: state.edges,
  onEdgesChange: state.onEdgesChange,
  onConnectEdge: state.onConnectEdge,
  onDisconnectEdge: state.onDisconnectEdge,
});

export function useAdmin() {
  const store = useNodeStore();
  const {
    nodes,
    onNodesPositionChange,
    setNodes,
    onEdgesChange,
    edges,
    onConnectEdge,
    onDisconnectEdge,
  } = useStore(store, useShallow(selector));
  const lastPosition = useRef({ x: 0, y: 0 });
  const positionChanged = useRef(false);
  const router = useRouter();
  const params = useParams<{ "app-name": string }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { mutateAsync, mutateConnect, mutateDisconnect } = useAdminAPI({
    setNodes,
  });

  const onPositionChange = useCallback(
    async (change: NodePositionChange) => {
      if (change.dragging === true) {
        lastPosition.current = change.position || { x: 0, y: 0 };
        positionChanged.current = true;
      }

      if (change.dragging === false) {
        const { id } = change;
        const { x, y } = lastPosition.current;

        if (!positionChanged.current) return;

        try {
          await mutateAsync({
            appName: params["app-name"],
            id,
            body: {
              x,
              y,
            },
          });

          positionChanged.current = false;

          router.refresh();
        } catch (error) {
          toast.error("Failed to update position");
        }
      }
    },
    [mutateAsync, params, router]
  );

  const onChangeNodeParams = useCallback(
    (node: Node<UserSession>) => {
      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set("node", node.id);

      const url = `${pathname}?${newSearchParams.toString()}`;
      window.history.replaceState({}, "", url);
    },
    [pathname, searchParams]
  );

  const onNodeDragStart: OnNodeDrag<Node<UserSession>> = useCallback(
    (_, node) => onChangeNodeParams(node),
    [onChangeNodeParams]
  );

  const onNodeClick: NodeMouseHandler<Node<UserSession>> = useCallback(
    (_, node) => onChangeNodeParams(node),
    [onChangeNodeParams]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<UserSession>>[]) => {
      onNodesPositionChange(onPositionChange, changes);
    },
    [onNodesPositionChange, onPositionChange]
  );

  const onConnect: OnConnect = useCallback(
    (p) => {
      onConnectEdge(async (edge) => {
        const { data } = edge;
        if (!data) return;

        mutateConnect({
          appName: params["app-name"],
          connection: data,
        });
      }, p);
    },
    [mutateConnect, onConnectEdge, params]
  );

  const onDisConnect: OnEdgesDelete<Edge<EdgeData>> = useCallback(
    (p) => {
      if (p.length !== 1) return;
      const edge = p[0];

      onDisconnectEdge(async (e) => {
        if (!e.data) return;

        mutateDisconnect({
          appName: params["app-name"],
          connection: e.data,
        });
      }, edge);
    },
    [mutateDisconnect, onDisconnectEdge, params]
  );

  return {
    nodes,
    onNodesChange,
    edges,
    onNodeClick,
    onEdgesChange,
    onConnect,
    onDisConnect,
    onNodeDragStart,
  };
}
