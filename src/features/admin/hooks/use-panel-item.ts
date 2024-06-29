import { useMutation } from "@tanstack/react-query";
import { ReadonlyURLSearchParams } from "next/navigation";
import React, { useCallback, useId } from "react";
import { changeNameActions } from "@/actions/cheange-name";

import { changeDeviceData } from "@/features/admin/api";
import { UserSession } from "@/features/admin/types";

type PanelItemProps = {
  session: UserSession;
  appName: string;
  active: boolean;
  searchParams: ReadonlyURLSearchParams;
  pathname: string;
};

type Size = {
  width: number;
  height: number;
};

type Position = {
  x: number;
  y: number;
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

  const action = changeNameActions.bind(null, appName, session.id);
  const id = useId();

  const onClickHandler = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("node", session.id);

    const url = `${pathname}?${newSearchParams.toString()}`;

    window.history.replaceState({}, "", url);
  }, [pathname, searchParams, session.id]);

  const [size, setSize] = React.useState<Size>({
    width: session.width,
    height: session.height,
  });

  const [position, setPosition] = React.useState<Position>({
    x: Number(session.assignPosition.startX.toFixed(0)),
    y: Number(session.assignPosition.startY.toFixed(0)),
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        await mutateAsync({
          id: session.id,
          appName,
          ...size,
          ...position,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [appName, mutateAsync, position, session.id, size]
  );

  const onChangeSizeHandler = useCallback(
    (t: keyof Size) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.currentTarget;

      setSize((prev) => ({
        ...prev,
        [t]: parseInt(target.value, 10),
      }));
    },
    []
  );

  const onChangePositionHandler = useCallback(
    (t: keyof Position) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const target = e.currentTarget;

      setPosition((prev) => ({
        ...prev,
        [t]: parseInt(target.value, 10),
      }));
    },
    []
  );

  return {
    action,
    handleSubmit,
    onChangeSizeHandler,
    onChangePositionHandler,
    onClickHandler,
    id,
    active,
    size,
    position,
    isPending,
  };
}
