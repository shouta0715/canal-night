import { useAtomValue } from "jotai";
import React from "react";
import { Mode, interactionAtom } from "@/features/admin/store";
import { cn } from "@/lib/utils";

export function Tablet({
  children,
  id,
  active,
  mode,
}: {
  children: React.ReactNode;
  id: string;
  active: boolean;
  mode: Mode;
}) {
  const interactionId = useAtomValue(interactionAtom);

  return (
    <div
      className={cn(
        "relative size-full rounded-[40px] border-[20px] border-black bg-white/80 transition-[border-color] duration-300 ease-in-out",
        interactionId === id ? "border-yellow-500" : "border-primary",
        active && mode === "connect" ? "border-green-500" : "",
        active && mode === "view" ? "border-blue-500" : ""
      )}
    >
      <div className="size-full rounded-[10px] p-10">{children}</div>
    </div>
  );
}
