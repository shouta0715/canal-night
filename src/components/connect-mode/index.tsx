import { useQuery } from "@tanstack/react-query";
import React from "react";
import { API_URL } from "@/constant";
import { UserState } from "@/types";

type ConnectModeProps = {
  id: string;
  appName: string;
  isConnecting: boolean;
};

const fetchState = async (appName: string, id: string): Promise<UserState> => {
  const response = await fetch(`${API_URL}/${appName}/${id}/state`);

  return response.json();
};

export function ConnectMode({ id, appName, isConnecting }: ConnectModeProps) {
  const { isPending, data } = useQuery({
    queryKey: [appName, id],
    queryFn: () => fetchState(appName, id),
    enabled: !isConnecting,
    gcTime: 0,
    staleTime: 0,
  });

  if (isPending) return <div>接続中</div>;

  return (
    <div className="flex h-dvh items-center justify-center">
      <p className="text-4xl font-bold">{data?.displayname}</p>
    </div>
  );
}
