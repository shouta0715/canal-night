import { API_URL } from "@/constant";

type FetchChangedPosition = {
  appName: string;
  id: string;
  position: { x: number; y: number };
};

export const fetchChangedPosition = async ({
  appName,
  id,
  position,
}: FetchChangedPosition) => {
  const res = await fetch(`${API_URL}/${appName}/admin/${id}/position`, {
    method: "POST",
    body: JSON.stringify(position),
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to update position");
};
