import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/constant";

const onOver = async ({
  x,
  id,
  data,
}: {
  id: string;
  x: number;
  data: { src: string; dish: number };
}) => {
  const res = await fetch(`${API_URL}/conveyor-belt-sushi/${id}/over`, {
    method: "POST",
    body: JSON.stringify({ x, id, y: 0, data }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to over sushi");
  }

  return res.json();
};

export function useMutateOver() {
  const { mutate } = useMutation({
    mutationFn: onOver,
  });

  return { mutate };
}
