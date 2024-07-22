import React from "react";
import { API_URL } from "@/constant";
import { AdminFlow } from "@/features/admin/components";
import { NodeProvider } from "@/features/admin/components/providers";
import { CustomsInput } from "@/features/admin/schema";
import { UserSession } from "@/features/admin/types";

const getInitialSessions = async (appName: string): Promise<UserSession[]> => {
  const res = await fetch(`${API_URL}/${appName}/admin/sessions`, {
    cache: "no-store",
  });

  const data = await res.json();

  return data;
};

const getInitialCustoms = async (appName: string): Promise<CustomsInput> => {
  const res = await fetch(`${API_URL}/${appName}/admin/customs`, {
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
  const [sessions, customs] = await Promise.all([
    getInitialSessions(appName),
    getInitialCustoms(appName),
  ]);

  return (
    <div className="h-dvh w-screen">
      <NodeProvider customs={customs} initialSession={sessions}>
        <AdminFlow />
      </NodeProvider>
    </div>
  );
}
