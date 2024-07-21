import { API_URL } from "@/constant";
import { Mode } from "@/features/admin/store";
import { Alignment, Connection } from "@/features/admin/types";

type FetchChangedPosition = {
  appName: string;
  id: string;
  body: { x: number; y: number; alignment: Alignment };
};

export const fetchChangedPosition = async ({
  appName,
  id,
  body,
}: FetchChangedPosition) => {
  const res = await fetch(`${API_URL}/${appName}/admin/${id}/position`, {
    method: "POST",
    body: JSON.stringify(body),
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

export const changeMode = async ({
  appName,
  mode,
}: {
  appName: string;
  mode: Mode;
}) => {
  const res = await fetch(`${API_URL}/${appName}/admin/mode`, {
    method: "POST",
    body: JSON.stringify({ mode }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch mode");
  }
};

export const onConnect = async ({
  appName,
  connection,
}: {
  appName: string;
  connection: Connection;
}) => {
  const res = await fetch(
    `${API_URL}/${appName}/admin/${connection.source}/connect`,
    {
      method: "POST",
      body: JSON.stringify(connection),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch connect");
  }
};
