import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/constant";
import { Mode } from "@/features/admin/store";
import { Alignment } from "@/features/admin/types";
import { useSocket } from "@/hooks";
import { Direction, UserState } from "@/types";

export type ConnectionAction = {
  action: "connection";
  alignment: Alignment;
  sourceState: UserState;
};

export type OverAction = {
  sender: UserState;
  x: number;
  y: number;
  id: string;
  target: string;
  from: Direction;
  to: Direction;
  source: string;
  action: "over";
};

export type JoinAction = {
  action: "join";
  state: UserState;
};

export type DeviceAction = {
  action: "device";
} & UserState;

export type ModeAction = {
  action: "mode";
  mode: Mode;
};

export type UploadAction = {
  action: "uploaded";
  id: string;
};

export type RiverBallData =
  | ConnectionAction
  | OverAction
  | JoinAction
  | DeviceAction
  | ModeAction
  | UploadAction;

type UseRiverBallAPIProps = {
  id: string;
  appName: string;
  cb: (data: RiverBallData) => void;
};

export function useRiverBallAPI({ id, appName, cb }: UseRiverBallAPIProps) {
  const socket = useSocket<RiverBallData>({
    appName,
    id,
    width: window.innerWidth,
    height: window.innerHeight,
    callback: cb,
  });

  return {
    ...socket,
  };
}
const onOver = async ({
  x,
  y,
  id,
  data,
  direction,
}: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
  data: { src: string };
}) => {
  const res = await fetch(`${API_URL}/canal-night/${id}/over`, {
    method: "POST",
    body: JSON.stringify({ x, id, y, data, direction }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to over sushi");
  }

  return res.json();
};

export function useMutateOver() {
  const { mutate } = useMutation({
    mutationFn: onOver,
  });

  return { mutate };
}
