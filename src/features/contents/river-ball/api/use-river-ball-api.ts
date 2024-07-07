import { useSocket } from "@/hooks";

export type RiverBallData = {
  id: string;
  action: "uploaded";
};

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
    callback: (data) => {
      if (data.action === "uploaded") cb(data);
    },
  });

  return {
    ...socket,
  };
}
