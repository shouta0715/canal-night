"use client";

import { ChevronRight, Loader2, Trash } from "lucide-react";
import { ReadonlyURLSearchParams } from "next/navigation";
import React from "react";
import { FormProvider } from "react-hook-form";
import { deletePersistentState } from "@/actions/cheange-name";
import {
  AccordionButton,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/features/admin/components/errors";
import { CustomForm } from "@/features/admin/components/panel-item/form";
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
    action,
    onSubmit,
    register,
    onChangeIsStartDevice,
    getValues,
    isPending,
    id,
    isDirty,
    errors,
    customs,
    control,
    methods,
  } = usePanelItem({ session, appName, active, searchParams, pathname });

  const deleteAction = deletePersistentState
    .bind(null, appName)
    .bind(null, session.id);

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
        <FormProvider {...methods}>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-width`}>画面の幅（横幅）（px）</Label>
              <Input
                defaultValue={session.width}
                {...register("width", {
                  valueAsNumber: true,
                })}
                id={`${id}-width`}
              />
              {errors.width?.message && (
                <ErrorMessage>{errors.width.message}</ErrorMessage>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-height`}>画面の高さ（縦幅）（px）</Label>
              <Input
                defaultValue={session.height}
                {...register("height", {
                  valueAsNumber: true,
                })}
                id={`${id}-height`}
              />
              {errors.height?.message && (
                <ErrorMessage>{errors.height.message}</ErrorMessage>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-x`}>X座標</Label>
              <Input
                defaultValue={session.assignPosition.startX.toFixed(0)}
                {...register("x", {
                  valueAsNumber: true,
                })}
                id={`${id}-x`}
              />
              {errors.x?.message && (
                <ErrorMessage>{errors.x.message}</ErrorMessage>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-y`}>Y座標</Label>
              <Input
                defaultValue={session.assignPosition.startY.toFixed(0)}
                {...register("y", {
                  valueAsNumber: true,
                })}
                id={`${id}-y`}
              />

              {errors.y?.message && (
                <ErrorMessage>{errors.y.message}</ErrorMessage>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={getValues("isStartDevice")}
                id={`${id}-start-device`}
                onCheckedChange={onChangeIsStartDevice}
              />
              <Label htmlFor={`${id}-start-device`}>
                データ送信の開始端末に設定する
              </Label>

              {errors.isStartDevice?.message && (
                <ErrorMessage>{errors.isStartDevice.message}</ErrorMessage>
              )}
            </div>

            <Button
              className="mx-auto w-max px-6 font-semibold"
              disabled={isPending || !isDirty}
              size="sm"
              type="submit"
            >
              {isPending && <Loader2 className="mr-2 animate-spin" size={16} />}
              変更する
            </Button>

            {customs.map((custom, i) => {
              return (
                <div
                  key={custom.key.toString() || i}
                  className="flex flex-col gap-2"
                >
                  <CustomForm
                    control={control}
                    defaultValue={custom.defaultValue}
                    label={custom.label}
                    name={custom.key}
                    type={custom.type}
                  />
                  {errors.custom?.[custom.key]?.message && (
                    <ErrorMessage>
                      {errors.custom[custom.key]?.message}
                    </ErrorMessage>
                  )}
                </div>
              );
            })}
          </form>
        </FormProvider>

        <form
          action={deleteAction}
          className="mt-4 flex items-center justify-center"
        >
          <Button
            className="px-6 font-semibold"
            type="submit"
            variant="destructive"
          >
            <Trash className="mr-2" size={16} />
            永続化データを削除する
          </Button>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
