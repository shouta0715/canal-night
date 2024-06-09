import clsx from "clsx";
import { useAtomValue } from "jotai";
import React from "react";
import { interactionAtom } from "@/features/admin/store";

export const Monitor = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const interactionId = useAtomValue(interactionAtom);

  return (
    <div
      className={clsx(
        "size-full rounded-[40px] border-8 bg-white/80 transition-[border-color] duration-300 ease-in-out",
        interactionId === id ? "border-yellow-500" : "border-primary"
      )}
    >
      <div className="size-full p-10">{children}</div>
    </div>
  );
};
