import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/constant";
import { Direction } from "@/types";

const onOver = async ({
  x,
  id,
  data,
  direction,
}: {
  id: string;
  x: number;
  direction: Direction;
  data: { src: string; dish: number };
}) => {
  const res = await fetch(`${API_URL}/conveyor-belt-sushi/${id}/over`, {
    method: "POST",
    body: JSON.stringify({ x, id, y: 0, data, direction }),
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
