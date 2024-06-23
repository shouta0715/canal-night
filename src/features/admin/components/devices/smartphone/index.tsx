import clsx from "clsx";
import { useAtomValue } from "jotai";
import React from "react";
import { interactionAtom } from "@/features/admin/store";

export function SmartPhone({
  children,
  id,
  active,
}: {
  children: React.ReactNode;
  id: string;
  active: boolean;
}) {
  const interactionId = useAtomValue(interactionAtom);

  return (
    <div
      className={clsx(
        "size-full rounded-[40px] border-[12px] bg-white/80 transition-[border-color] duration-300 ease-in-out",
        interactionId === id ? "border-yellow-500" : "border-primary",
        active ? "border-pink-500" : ""
      )}
    >
      <div
        aria-hidden="true"
        className="relative mx-auto h-6 w-1/2 rounded-b-full border-8 border-black bg-black"
      >
        <div className="mx-auto size-1/2 rounded-full bg-[#f0f0f0]" />
        <div className="absolute left-4 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-[#f0f0f0]" />
      </div>
      <div className="size-full p-10">{children}</div>
    </div>
  );
}
