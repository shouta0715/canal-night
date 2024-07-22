import { API_URL } from "@/constant";
import { CustomInput } from "@/features/admin/schema";
import { Mode } from "@/features/admin/store";
import { Connection } from "@/features/admin/types";

type FetchChangedPosition = {
  appName: string;
  id: string;
  body: { x: number; y: number };
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

export const onDisconnect = async ({
  appName,
  connection,
}: {
  appName: string;
  connection: Connection;
}) => {
  const res = await fetch(
    `${API_URL}/${appName}/admin/${connection.source}/disconnect`,
    {
      method: "POST",
      body: JSON.stringify(connection),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch disconnect");
  }
};

export const addCustom = async ({
  data,
  appName,
}: {
  appName: string;
  data: CustomInput;
}) => {
  const res = await fetch(`${API_URL}/${appName}/admin/customs`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch customs");
  }
};

export const deleteCustom = async ({
  key,
  appName,
}: {
  appName: string;
  key: string;
}) => {
  const res = await fetch(`${API_URL}/${appName}/admin/customs/${key}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch customs");
  }
};

export const updateCustom = async ({
  key,
  data,
  appName,
}: {
  appName: string;
  key: string;
  data: CustomInput;
}) => {
  const res = await fetch(`${API_URL}/${appName}/admin/customs/${key}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch customs");
  }
};
