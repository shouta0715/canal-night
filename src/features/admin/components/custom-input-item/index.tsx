import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { useStore } from "zustand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteCustom, updateCustom } from "@/features/admin/api";
import { CustomInputFormDialog } from "@/features/admin/components/custom-input/form";
import { useNodeStore } from "@/features/admin/components/providers";
import { CustomInput as TCustomInput } from "@/features/admin/schema";
import { cn } from "@/lib/utils";

type CustomInputProps = {
  custom: TCustomInput;
};
export function CustomInputItem({ custom }: CustomInputProps) {
  const store = useNodeStore();
  const { deleteStoreCustom, updateStoreCustom } = useStore(store, (s) => ({
    deleteStoreCustom: s.deleteCustom,
    updateStoreCustom: s.updateCustom,
  }));
  const params = useParams<{ "app-name": string }>();

  const [open, setOpen] = React.useState(false);
  const { mutate } = useMutation({
    onMutate: updateCustom,
  });

  const { mutate: mutateDelete } = useMutation({
    onMutate: deleteCustom,
  });

  const submitHandler = (data: TCustomInput) => {
    mutate({ appName: params["app-name"], data, key: custom.key });
    updateStoreCustom(custom.key, data);
  };

  const onDelete = () => {
    mutateDelete({ appName: params["app-name"], key: custom.key });
    deleteStoreCustom(custom.key);
  };

  return (
    <>
      <CustomInputFormDialog
        buttonLabel="更新する"
        defaultValues={custom}
        isEdit
        open={open}
        setOpen={setOpen}
        submitHandler={submitHandler}
      />
      <div className="grid gap-3">
        <div className="flex flex-col gap-2">
          キー
          <span className="line-clamp-1 flex-1 bg-muted px-2 py-1 text-destructive">
            {custom.key}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          ラベル
          <span className="line-clamp-1 flex-1 bg-muted px-2 py-1 text-destructive">
            {custom.label}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          型
          <span className="line-clamp-1 flex-1 bg-muted px-2 py-1 text-destructive">
            {custom.type}
          </span>
        </div>

        {(custom.defaultValue || typeof custom.defaultValue === "boolean") && (
          <div className="flex flex-col gap-2">
            初期値
            <span className="line-clamp-1 flex-1 bg-muted px-2 py-1 text-destructive">
              {custom.defaultValue.toString()}
            </span>
          </div>
        )}

        <p className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger
              className={cn(
                buttonVariants({
                  variant: "destructive",
                }),
                "flex h-8 items-center gap-1.5 text-xs font-bold"
              )}
            >
              削除する
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  削除した場合、すべての端末にデータが送信されなくなります。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex w-full justify-between sm:justify-between">
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction
                  className={cn(
                    buttonVariants({ variant: "destructive" }),
                    "font-bold"
                  )}
                  onClick={() => onDelete()}
                >
                  削除する
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            className="flex h-8 items-center gap-1.5 text-xs font-bold"
            onClick={() => {
              setOpen(true);
            }}
          >
            編集する
          </Button>
        </p>
      </div>
    </>
  );
}
