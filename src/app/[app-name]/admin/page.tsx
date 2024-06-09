import React from "react";
import { API_URL } from "@/constant";
import { AdminFlow } from "@/features/admin/components";
import { UserSession } from "@/features/ripples/types";
import { sessionToNode } from "@/features/ripples/utils";

const getInitialSessions = async (appName: string): Promise<UserSession[]> => {
  const res = await fetch(`${API_URL}/${appName}/admin/sessions`, {
    cache: "no-store",
  });

  const data = await res.json();

  return data;
};

export default async function Page({
  params,
}: {
  params: { "app-name": string };
}) {
  const appName = params["app-name"];
  const sessions = await getInitialSessions(appName);

  return (
    <div className="h-dvh w-screen">
      <AdminFlow initialNodes={sessionToNode(sessions)} />
    </div>
  );
}
