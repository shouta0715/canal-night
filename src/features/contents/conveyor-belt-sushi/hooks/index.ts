import { useCallback, useRef, useState } from "react";
import { Alignment, AssignedPosition } from "@/features/admin/types";
import { useMutateOver } from "@/features/contents/conveyor-belt-sushi/api";
import { useMode, useSocket } from "@/hooks";
import { ActionImage, ActionMode, ActionPosition, ContentProps } from "@/types";

const appName = "conveyor-belt-sushi";

type Data =
  | ActionPosition
  | ActionMode
  | ActionImage
  | {
      action: "over";
      y: number;
      x: number;
      id: string;
      data: { src: string; dish: number };
    };

type Sushi = {
  id: string;
  x: number;
  dish: number;
};

export function useConveyorBeltSushi({ id: slug, initialMode }: ContentProps) {
  const { mode, onModeRedirect } = useMode(appName, initialMode);
  const alignment = useRef<Alignment>({
    isLeft: false,
    isRight: false,
  });
  const assignedPosition = useRef<AssignedPosition | null>();

  const [sushi, setSushi] = useState<Sushi[]>([]);
  const { mutate } = useMutateOver();

  const callback = useCallback(
    (data: Data) => {
      if (data.action === "mode") {
        onModeRedirect(data.mode);
      }

      if (data.action === "position") {
        alignment.current = data.alignment;
        assignedPosition.current = data.assignPosition;
      }

      if (data.action === "over") {
        if (data.id === slug) return;
        if (alignment.current.isLeft) return;
        setSushi((p) => [
          ...p,
          { id: data.data.src, x: data.x, dish: data.data.dish },
        ]);
      }

      if (data.action === "uploaded") {
        if (!alignment.current.isLeft) return;
        const dish = Math.floor(Math.random() * 4) + 1;
        setSushi((p) => [...p, { id: data.id, x: -300, dish }]);
      }
    },
    [onModeRedirect, slug]
  );

  const { isConnecting } = useSocket<Data>({
    callback,
    appName,
    id: slug,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const onAnimateComplete = (id: string) => {
    setSushi((p) => p.filter((su) => su.id !== id));
  };

  const onOverWindow = (id: string, position: number, dish: number) => {
    if (alignment.current.isRight) return;

    mutate({
      id: slug,
      x: Math.round(position),
      direction: "right",
      data: { src: id, dish },
    });
  };

  return {
    isConnecting,
    mode,
    onAnimateComplete,
    onOverWindow,
    sushi,
    alignment,
  };
}
