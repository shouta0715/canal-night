import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { WS_URL } from "@/constant";
import { useMode } from "@/hooks";

type UseAdminSocketProps<T> = {
  callback: (data: T) => void;
  appName: string;
};
export function useAdminSocket<T>({
  callback,
  appName,
}: UseAdminSocketProps<T>) {
  const { mode } = useMode(appName);
  const { lastJsonMessage, sendJsonMessage } = useWebSocket<T>(
    `${WS_URL}/${appName}/admin`,
    {
      queryParams: {
        mode,
      },
    }
  );

  const callBackRef = useRef(callback);

  useEffect(() => {
    if (!lastJsonMessage) return;

    callBackRef.current(lastJsonMessage);
  }, [lastJsonMessage]);

  return { lastJsonMessage, sendJsonMessage };
}
