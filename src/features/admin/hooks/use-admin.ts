import { useParams, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import {
  Node,
  NodeChange,
  NodePositionChange,
  applyNodeChanges,
} from "reactflow";
import { toast } from "sonner";
import { useAdminAPI } from "@/features/admin/api/use-admin-api";
import { AdminNode } from "@/features/admin/types";

type UseAdminProps = {
  initialNodes: Node<AdminNode>[];
};

export function useAdmin({ initialNodes }: UseAdminProps) {
  const [nodes, setNodes] = useState<Node<AdminNode>[]>(initialNodes);
  const lastPosition = useRef({ x: 0, y: 0 });
  const router = useRouter();
  const params = useParams<{ "app-name": string }>();

  const { mutateAsync } = useAdminAPI({ setNodes });

  const onPositionChange = useCallback(
    async (change: NodePositionChange, _: Node<AdminNode>[]) => {
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

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => {
        const ch = changes[0];

        if (ch.type === "position") onPositionChange(ch, nds);

        return applyNodeChanges<AdminNode>(changes, nds);
      }),
    [onPositionChange]
  );

  return {
    nodes,
    onPositionChange,
    onNodesChange,
  };
}
