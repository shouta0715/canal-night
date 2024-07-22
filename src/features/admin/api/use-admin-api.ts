import { useMutation } from "@tanstack/react-query";
import { Node } from "@xyflow/react";
import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  fetchChangedPosition,
  onConnect,
  onDisconnect,
} from "@/features/admin/api";
import { useNodeStore } from "@/features/admin/components/providers";
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
  ConnectionAdminData,
} from "@/features/admin/types";
import { getDefaultNode } from "@/features/admin/utils";

type UseAdminAPIProps = {
  setNodes: RFState["setNodes"];
};

export function useAdminAPI({ setNodes }: UseAdminAPIProps) {
  const params = useParams<{ "app-name": string }>();
  const store = useNodeStore();
  const { updateNode } = useStore(
    store,
    useShallow((s) => ({ updateNode: s.updateNode }))
  );

  const setInteractionId = useSetAtom(interactionAtom);

  const { mutateAsync } = useMutation({
    mutationFn: fetchChangedPosition,
  });

  const { mutateAsync: mutateConnect } = useMutation({
    mutationFn: onConnect,
  });
  const { mutateAsync: mutateDisconnect } = useMutation({
    mutationFn: onDisconnect,
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
      setNodes((prev) => {
        const targetNodeIndex = prev.findIndex((n) => n.id === data.id);
        const node = prev[targetNodeIndex];
        if (!node) return prev;

        const newNodes = prev.filter((nd) => nd.id !== id);

        const newNode = {
          ...node,
          data: {
            ...node.data,
            width,
            height,
          },
        };

        newNodes.splice(targetNodeIndex, 0, newNode);

        return newNodes;
      });
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
            alignment: data.alignment,
          },
        };

        newNodes.splice(targetNodeIndex, 0, newNode);

        return newNodes;
      });
    },
    [setNodes]
  );

  const onConnection = useCallback(
    (data: ConnectionAdminData) => {
      const { source, target } = data;
      updateNode(source.id, source);
      updateNode(target.id, target);
    },
    [updateNode]
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

      if (data.action === "connection") onConnection(data);
    },
    appName: params["app-name"],
  });

  return {
    mutateAsync,
    mutateConnect,
    mutateDisconnect,
  };
}
