"use server";

import { API_URL } from "@/constant";

export async function changeNameActions(
  appName: string,
  id: string,
  formData: FormData
) {
  await fetch(`${API_URL}/${appName}/admin/${id}/displayname`, {
    method: "POST",
    body: formData,
  });
}

export async function deletePersistentState(appName: string, id: string) {
  await fetch(`${API_URL}/${appName}/admin/${id}/state`, {
    method: "DELETE",
  });
}
