import { useMutation } from "@tanstack/react-query";
import { Node, OnResizeEnd, useNodesData } from "@xyflow/react";
import { useAtomValue } from "jotai";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { changeSize } from "@/features/admin/api";
import { Mode, interactionAtom } from "@/features/admin/store";
import { UserSession } from "@/features/admin/types";

type Size = {
  width: number;
  height: number;
};

type UseCustomNodeProps = {
  data: UserSession;
  id: string;
};

export function useCustomNode({ data, id }: UseCustomNodeProps) {
  const searchParams = useSearchParams();
  const node = searchParams.get("node") || "";
  const mode = (searchParams.get("mode") || "view") as Mode;
  const params = useParams<{ "app-name": string }>();
  const { width, height, displayname } = data;
  const interactionId = useAtomValue(interactionAtom);

  const { mutate, isPending } = useMutation({
    mutationFn: changeSize,
  });

  const [inputSize, setInputSize] = useState<Size>({ width, height });

  const storeNode = useNodesData<Node<UserSession>>(id);

  useEffect(() => {
    if (!storeNode?.data) return;

    setInputSize({
      width: storeNode.data.width,
      height: storeNode.data.height,
    });
  }, [storeNode?.data]);

  const onResizeEnd: OnResizeEnd = useCallback(
    (_, size) => {
      if (isPending) return;
      mutate({
        id,
        width: size.width,
        height: size.height,
        appName: params["app-name"],
      });
    },
    [id, isPending, mutate, params]
  );

  return {
    inputSize,
    node,
    mode,
    interactionId,
    onResizeEnd,
    displayname,
    setInputSize,
  };
}
