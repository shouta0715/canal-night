import { API_URL } from "@/constant";
import { Mode } from "@/features/admin/store";

export async function fetchResize({
  id,
  appName,
}: {
  id: string;
  appName: string;
}) {
  const res = await fetch(`${API_URL}/${appName}/${id}/resize`, {
    method: "POST",
    body: JSON.stringify({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resize");
  }
}

export const getInitialMode = async (
  appName: string
): Promise<{ mode: Mode }> => {
  const res = await fetch(`${API_URL}/${appName}/mode`, {
    method: "GET",
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch initial mode");
  }

  const mode = await res.json();

  return mode;
};
