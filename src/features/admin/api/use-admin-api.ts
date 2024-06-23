import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { Node } from "reactflow";
import { toast } from "sonner";
import { fetchChangedPosition } from "@/features/admin/api";
import { useAdminSocket } from "@/features/admin/hooks/use-admin-socket";
import { RFState, interactionAtom } from "@/features/admin/store";
import {
  ChangeDisplaynameAdminData,
  AdminData,
  ChangeDeviceAdminData,
  JoinAdminData,
  ResizeAdminData,
  UserSession,
  ChangePositionAdminData,
} from "@/features/admin/types";
import { getDefaultNode } from "@/features/admin/utils";

type UseAdminAPIProps = {
  setNodes: RFState["setNodes"];
};

export function useAdminAPI({ setNodes }: UseAdminAPIProps) {
  const params = useParams<{ "app-name": string }>();

  const setInteractionId = useSetAtom(interactionAtom);

  const { mutateAsync } = useMutation({
    mutationFn: fetchChangedPosition,
  });

  const onJoin = useCallback(
    (data: JoinAdminData) => {
      const newNode = getDefaultNode(data);

      setNodes((nds) => [...nds, newNode]);

      toast.success("新しい端末が接続されました");
    },
    [setNodes]
  );

  const onLeave = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((nd) => nd.id !== id));

      toast.error("端末が切断されました");
    },
    [setNodes]
  );

  const onInteraction = useCallback(
    (id: string) => {
      setInteractionId(id);
    },
    [setInteractionId]
  );

  const onResize = useCallback(
    (data: ResizeAdminData) => {
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
    },
    [setNodes]
  );

  const onDevice = useCallback(
    (data: ChangeDeviceAdminData) => {
      setNodes((prev) => {
        const targetNodeIndex = prev.findIndex((n) => n.id === data.id);
        const node = prev[targetNodeIndex];
        if (!node) return prev;
        const newNodes = prev.filter((n) => n.id !== data.id);

        const newNode: Node<UserSession> = {
          ...node,
          data: {
            ...data,
            width: data.width,
            height: data.height,
          },
          position: {
            x: data.x,
            y: data.y,
          },
        };

        newNodes.splice(targetNodeIndex, 0, newNode);

        return newNodes;
      });
    },
    [setNodes]
  );

  const onDisplayname = useCallback(
    (data: ChangeDisplaynameAdminData) => {
      setNodes((prev) => {
        const targetNodeIndex = prev.findIndex((n) => n.id === data.id);
        const node = prev[targetNodeIndex];
        if (!node) return prev;
        const newNodes = prev.filter((n) => n.id !== data.id);

        const newNode: Node<UserSession> = {
          ...node,
          data: {
            ...node.data,
            displayname: data.displayname,
          },
        };

        newNodes.splice(targetNodeIndex, 0, newNode);

        return newNodes;
      });
    },
    [setNodes]
  );

  const onPosition = useCallback(
    (data: ChangePositionAdminData) => {
      setNodes((prev) => {
        const targetNodeIndex = prev.findIndex((n) => n.id === data.id);
        const node = prev[targetNodeIndex];
        if (!node) return prev;
        const newNodes = prev.filter((n) => n.id !== data.id);

        const newNode: Node<UserSession> = {
          ...node,
          data: {
            ...node.data,
            assignPosition: data.assignPosition,
          },
        };

        newNodes.splice(targetNodeIndex, 0, newNode);

        return newNodes;
      });
    },
    [setNodes]
  );

  useAdminSocket<AdminData>({
    callback: (data) => {
      if (data.action === "join") onJoin(data);

      if (data.action === "leave") onLeave(data.id);

      if (data.action === "interaction") onInteraction(data.id);

      if (data.action === "resize") onResize(data);

      if (data.action === "device") onDevice(data);

      if (data.action === "displayname") onDisplayname(data);

      if (data.action === "position") onPosition(data);
    },
    appName: params["app-name"],
  });

  return {
    mutateAsync,
  };
}
