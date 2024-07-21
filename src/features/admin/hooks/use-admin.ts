import { Node, NodeChange, NodePositionChange, OnConnect } from "@xyflow/react";
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
import { UserSession } from "@/features/admin/types";
import { calculateAlignment } from "@/features/admin/utils/calculate-position";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
  onNodesChange: state.onNodesChange,
  onNodesPositionChange: state.onNodesPositionChange,
  edges: state.edges,
  onEdgesChange: state.onEdgesChange,
  onConnectEdge: state.onConnectEdge,
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
  } = useStore(store, useShallow(selector));
  const lastPosition = useRef({ x: 0, y: 0 });
  const positionChanged = useRef(false);
  const router = useRouter();
  const params = useParams<{ "app-name": string }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { mutateAsync } = useAdminAPI({ setNodes });

  const onPositionChange = useCallback(
    async (change: NodePositionChange, ns: Node<UserSession>[]) => {
      if (change.dragging === true) {
        lastPosition.current = change.position || { x: 0, y: 0 };
        positionChanged.current = true;
      }

      if (change.dragging === false) {
        const { id } = change;
        const { x, y } = lastPosition.current;

        if (!positionChanged.current) return;

        const {
          isLeft,
          isRight,
          nodes: changedNodes,
        } = calculateAlignment({ nodes: ns, x, y, id });

        const body = { x, y, alignment: { isLeft, isRight } };

        try {
          const promises = changedNodes.map((node) => {
            return mutateAsync({
              appName: params["app-name"],
              id: node.id,
              body: {
                x: node.position.x,
                y: node.position.y,
                alignment: { ...node.data.alignment },
              },
            });
          });

          await Promise.all([
            ...promises,
            mutateAsync({
              appName: params["app-name"],
              id,
              body,
            }),
          ]);

          positionChanged.current = false;

          router.refresh();
        } catch (error) {
          toast.error("Failed to update position");
        }
      }
    },
    [mutateAsync, params, router]
  );

  const onNodeDragStart = useCallback(
    (_: React.MouseEvent, node: Node<UserSession>) => {
      const { id } = node;
      const newSearchParams = new URLSearchParams(searchParams);

      newSearchParams.set("node", id);

      const url = `${pathname}?${newSearchParams.toString()}`;
      window.history.replaceState({}, "", url);
    },
    [pathname, searchParams]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<UserSession>>[]) => {
      onNodesPositionChange(onPositionChange, changes);
    },
    [onNodesPositionChange, onPositionChange]
  );

  const onConnect: OnConnect = useCallback(
    (p) => {
      onConnectEdge(async () => {}, p);
    },
    [onConnectEdge]
  );

  return {
    nodes,
    onPositionChange,
    onNodesChange,
    onNodeDragStart,
    edges,
    onEdgesChange,
    onConnect,
  };
}
