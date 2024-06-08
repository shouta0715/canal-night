"use server";

import { redirect } from "next/navigation";
import { API_URL } from "@/constant";

export async function registerActions(appName: string) {
  const res = await fetch(`${API_URL}/${appName}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const { id } = (await res.json()) as { id: string };

  redirect(`/${appName}/${id}`);
}
