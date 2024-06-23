import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { Node, NodeChange, NodePositionChange } from "reactflow";
import { toast } from "sonner";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useAdminAPI } from "@/features/admin/api/use-admin-api";
import { useNodeStore } from "@/features/admin/components/providers";
import { RFState } from "@/features/admin/store";
import { UserSession } from "@/features/admin/types";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
  onNodesChange: state.onNodesChange,
  onNodesPositionChange: state.onNodesPositionChange,
});

export function useAdmin() {
  const store = useNodeStore();
  const { nodes, onNodesPositionChange, setNodes } = useStore(
    store,
    useShallow(selector)
  );
  const lastPosition = useRef({ x: 0, y: 0 });
  const router = useRouter();
  const params = useParams<{ "app-name": string }>();
  const pathname = usePathname();

  const { mutateAsync } = useAdminAPI({ setNodes });

  const onPositionChange = useCallback(
    async (change: NodePositionChange, _: Node<UserSession>[]) => {
      if (change.dragging === true) {
        lastPosition.current = change.position || { x: 0, y: 0 };
      }

      if (change.dragging === false) {
        const { id } = change;
        const position = lastPosition.current;
        if (!position) return;

        try {
          await mutateAsync({
            appName: params["app-name"],
            id,
            position,
          });

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

      const url = `${pathname}?node=${id}`;
      window.history.replaceState({}, "", url);
    },
    [pathname]
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesPositionChange(onPositionChange, changes);
    },
    [onNodesPositionChange, onPositionChange]
  );

  return {
    nodes,
    onPositionChange,
    onNodesChange,
    onNodeDragStart,
  };
}
