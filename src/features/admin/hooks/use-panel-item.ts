import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation } from "@tanstack/react-query";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useCallback, useId } from "react";
import { useForm } from "react-hook-form";
import { useStore } from "zustand";
import { changeNameActions } from "@/actions/cheange-name";

import { changeDeviceData } from "@/features/admin/api";
import { useNodeStore } from "@/features/admin/components/providers";
import { DeviceInput, createUserCustomSchema } from "@/features/admin/schema";
import { UserSession } from "@/features/admin/types";

type PanelItemProps = {
  session: UserSession;
  appName: string;
  active: boolean;
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
};

export function usePanelItem({
  session,
  appName,
  active,
  searchParams,
  pathname,
}: PanelItemProps) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: changeDeviceData,
  });
  const store = useNodeStore();

  const action = changeNameActions.bind(null, appName, session.id);
  const id = useId();

  const { customs } = useStore(store, (s) => ({ customs: s.customs }));

  const methods = useForm<DeviceInput>({
    resolver: valibotResolver(createUserCustomSchema(customs)),

    defaultValues: {
      width: session.width,
      height: session.height,
      x: Number(session.assignPosition.startX.toFixed(0)),
      y: Number(session.assignPosition.startY.toFixed(0)),
      isStartDevice: session.isStartDevice,
      custom: session.custom,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    control,
    formState: { isDirty, isSubmitting, errors },
  } = methods;

  const onClickHandler = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("node", session.id);

    const url = `${pathname}?${newSearchParams.toString()}`;

    window.history.replaceState({}, "", url);
  }, [pathname, searchParams, session.id]);

  const onSubmit = handleSubmit(async (data) => {
    if (!isDirty || isSubmitting) return;
    try {
      await mutateAsync({
        id: session.id,
        appName,
        data,
      });
      reset(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  const onChangeIsStartDevice = useCallback(
    (b: boolean) => {
      setValue("isStartDevice", b, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue]
  );

  return {
    action,
    onSubmit,
    onClickHandler,
    id,
    active,
    isPending,
    isDirty,
    errors,
    register,
    onChangeIsStartDevice,
    getValues,
    customs,
    control,
    methods,
  };
}
