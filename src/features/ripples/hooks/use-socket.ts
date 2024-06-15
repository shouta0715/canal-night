import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "@/constant";

type UseSocketProps<T> = {
  callback: (data: T) => void;
  width: number;
  height: number;
  id: string;
};

export const useSocket = <T>({
  callback,
  id,
  width,
  height,
}: UseSocketProps<T>) => {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket<T>(
    `${WS_URL}/ripples/${id}`,
    {
      queryParams: {
        width,
        height,
      },
    }
  );

  useEffect(() => {
    if (!lastJsonMessage) return;

    callback(lastJsonMessage);
  }, [callback, lastJsonMessage]);

  return { lastJsonMessage, sendJsonMessage };
};
