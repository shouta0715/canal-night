import { API_URL } from "@/constant";

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
