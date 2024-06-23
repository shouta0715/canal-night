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

export async function changeSize({
  id,
  appName,
  width,
  height,
}: {
  id: string;
  appName: string;
  width: number;
  height: number;
}) {
  const res = await fetch(`${API_URL}/${appName}/${id}/resize`, {
    method: "POST",
    body: JSON.stringify({
      width,
      height,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resize");
  }
}

export const changeDeviceData = async ({
  id,
  appName,
  ...data
}: {
  id: string;
  appName: string;
  width: number;
  height: number;
  x: number;
  y: number;
}) => {
  const res = await fetch(`${API_URL}/${appName}/admin/${id}/device`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch resize");
  }
};
