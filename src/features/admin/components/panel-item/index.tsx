"use client";

import { ChevronRight, Loader2 } from "lucide-react";
import { ReadonlyURLSearchParams } from "next/navigation";
import React from "react";
import {
  AccordionButton,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePanelItem } from "@/features/admin/hooks/use-panel-item";
import { UserSession } from "@/features/admin/types";
import { cn } from "@/lib/utils";

type PanelItemProps = {
  session: UserSession;
  appName: string;
  active: boolean;
  isConnectMode: boolean;
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
};

export function PanelItem({
  session,
  appName,
  active,
  isConnectMode,
  searchParams,
  pathname,
}: PanelItemProps) {
  const {
    onClickHandler,
    onChangePositionHandler,
    onChangeSizeHandler,
    action,
    handleSubmit,
    isPending,
    size,
    position,
    id,
  } = usePanelItem({ session, appName, active, searchParams, pathname });

  return (
    <AccordionItem
      className="-mx-4"
      onClick={onClickHandler}
      value={session.id}
    >
      <AccordionHeader
        className={cn(
          " flex items-center gap-2 px-4 py-2",
          active ? "bg-blue-100" : "",
          active && isConnectMode ? "bg-green-100" : ""
        )}
      >
        <AccordionButton className="shrink-0 [&[data-state=open]>svg]:rotate-90">
          <ChevronRight size={16} />
        </AccordionButton>
        <form action={action} className="flex-1">
          <input
            className="w-full bg-inherit"
            defaultValue={session.displayname}
            name="displayname"
            type="text"
          />
        </form>
      </AccordionHeader>
      <AccordionContent
        className={cn(
          "px-4 py-2",
          active ? "bg-blue-50" : "",
          active && isConnectMode ? "bg-green-50" : ""
        )}
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-width`}>画面の幅（横幅）（px）</Label>
            <Input
              id={`${id}-width`}
              name="width"
              onChange={onChangeSizeHandler("width")}
              type="number"
              value={size.width}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-height`}>画面の高さ（縦幅）（px）</Label>
            <Input
              id={`${id}-height`}
              name="height"
              onChange={onChangeSizeHandler("height")}
              type="number"
              value={size.height}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-x`}>X座標</Label>
            <Input
              id={`${id}-x`}
              name="x"
              onChange={onChangePositionHandler("x")}
              type="number"
              value={position.x}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-y`}>Y座標</Label>
            <Input
              id={`${id}-y`}
              name="y"
              onChange={onChangePositionHandler("y")}
              type="number"
              value={position.y}
            />
          </div>

          <Button
            className="mx-auto w-max px-6 font-semibold"
            disabled={isPending}
            size="sm"
            type="submit"
          >
            {isPending && <Loader2 className="mr-2 animate-spin" size={16} />}
            変更する
          </Button>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
