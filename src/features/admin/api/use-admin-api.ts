import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { Node } from "reactflow";
import { toast } from "sonner";
import { fetchChangedPosition } from "@/features/admin/api";
import { useAdminSocket } from "@/features/admin/hooks/use-admin-socket";
import { interactionAtom } from "@/features/admin/store";
import { AdminData, AdminNode } from "@/features/admin/types";
import { getDefaultNode } from "@/features/admin/utils";

type UseAdminAPIProps = {
  setNodes: React.Dispatch<React.SetStateAction<Node<AdminNode>[]>>;
};

export function useAdminAPI({ setNodes }: UseAdminAPIProps) {
  const setInteractionId = useSetAtom(interactionAtom);

  const { mutateAsync } = useMutation({
    mutationFn: fetchChangedPosition,
  });
  useAdminSocket<AdminData>({
    callback: (data) => {
      if (data.action === "join") {
        const newNode = getDefaultNode(data);

        setNodes((nds) => [...nds, newNode]);

        toast.success("新しい端末が接続されました");
      }

      if (data.action === "leave") {
        setNodes((nds) => nds.filter((nd) => nd.id !== data.id));

        toast.error("端末が切断されました");
      }

      if (data.action === "interaction") {
        const { id } = data;
        setInteractionId(id);
      }

      if (data.action === "resize") {
        const { id, width, height } = data;

        setNodes((nds) => {
          const node = nds.find((nd) => nd.id === id);
          if (!node) return nds;

          const newNodes = nds.filter((nd) => nd.id !== id);

          const newNode = {
            ...node,
            data: {
              ...node.data,
              width,
              height,
            },
          };

          return [...newNodes, newNode];
        });

        toast.success("端末のサイズが変更されました");
      }
    },
    appName: "ripples",
  });

  return {
    mutateAsync,
  };
}
