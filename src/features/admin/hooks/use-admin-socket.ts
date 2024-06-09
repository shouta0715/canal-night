import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { API_URL } from "@/constant";

type UseAdminSocketProps<T> = {
  callback: (data: T) => void;
  appName: string;
};
export function useAdminSocket<T>({
  callback,
  appName,
}: UseAdminSocketProps<T>) {
  const { lastJsonMessage, sendJsonMessage } = useWebSocket<T>(
    `${API_URL}/${appName}/admin`
  );

  const callBackRef = useRef(callback);

  useEffect(() => {
    if (!lastJsonMessage) return;

    callBackRef.current(lastJsonMessage);
  }, [lastJsonMessage]);

  return { lastJsonMessage, sendJsonMessage };
}
