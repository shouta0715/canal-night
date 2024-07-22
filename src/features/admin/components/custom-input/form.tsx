import React, { useId } from "react";
import { Control, DeepPartial, useController, useWatch } from "react-hook-form";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomInputForm } from "@/features/admin/components/custom-input/use-custom-input-form";
import { ErrorMessage } from "@/features/admin/components/errors";
import { CustomInput as TCustomInput } from "@/features/admin/schema";

function DefaultValuesInput({ control }: { control: Control<TCustomInput> }) {
  const type = useWatch({ name: "type", control });
  const { field } = useController({ control, name: "defaultValue" });
  const id = useId();

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>デフォルト値</Label>
      {type === "string" && (
        <Input
          className="w-full border border-border"
          id={id}
          onChange={field.onChange}
        />
      )}
      {type === "number" && (
        <Input
          className="w-full border border-border"
          id={id}
          onChange={field.onChange}
        />
      )}
      {type === "boolean" && (
        <Select
          onValueChange={(v) => {
            field.onChange(v === "true");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="真偽値を選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

const TypeSelect = ({
  control,
  isEdit,
}: {
  control: Control<TCustomInput>;
  isEdit: boolean;
}) => {
  const { field } = useController({ control, name: "type" });

  return (
    <>
      <Label>データの型 {isEdit ? "(変更不可)" : ""}</Label>
      <Select
        defaultValue={field.value}
        disabled={isEdit}
        onValueChange={(v) => {
          field.onChange(v);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="型を選択" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="string">文字列</SelectItem>
          <SelectItem value="number">数値</SelectItem>
          <SelectItem value="boolean">真偽値</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

type CustomInputFormDialogProps = {
  submitHandler: (data: TCustomInput) => void | Promise<void>;
  onError?: (error: unknown) => void;
  defaultValues?: DeepPartial<TCustomInput>;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  buttonLabel?: string;
  isEdit?: boolean;
};
export function CustomInputFormDialog({
  submitHandler,
  onError,
  open,
  setOpen,
  buttonLabel,
  isEdit = false,
  defaultValues = {
    type: "string",
    defaultValue: "",
    label: "",
    key: "",
  },
}: CustomInputFormDialogProps) {
  const { register, onSubmit, errors, isDirty, isSubmitting, control } =
    useCustomInputForm({
      defaultValues,
      onError,
      submitHandler,
      setOpen,
    });

  return (
    <div>
      <AlertDialog onOpenChange={setOpen} open={open}>
        <AlertDialogContent>
          <AlertDialogTitle>カスタムデータを作成します</AlertDialogTitle>
          <AlertDialogDescription asChild className="text-primary">
            <form className="grid gap-8" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <Label>データのキー{isEdit ? " (変更不可)" : ""}</Label>
                <Input
                  disabled={isEdit}
                  {...register("key", { required: true })}
                  className="w-full border border-border"
                />
                {errors.key?.message && (
                  <ErrorMessage>{errors.key?.message}</ErrorMessage>
                )}
              </div>
              <div className="grid gap-2">
                <Label>データのラベル</Label>
                <Input
                  {...register("label", { required: true })}
                  className="w-full border border-border"
                />
                {errors.label?.message && (
                  <ErrorMessage>{errors.label?.message}</ErrorMessage>
                )}
              </div>

              <div className="grid gap-2">
                <TypeSelect control={control} isEdit={isEdit} />

                {errors.type?.message && (
                  <ErrorMessage>{errors.type?.message}</ErrorMessage>
                )}
              </div>

              <div className="grid gap-2">
                <DefaultValuesInput control={control} />

                {errors.defaultValue?.message && (
                  <ErrorMessage>{errors.defaultValue?.message}</ErrorMessage>
                )}
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel type="button">キャンセル</AlertDialogCancel>
                <Button
                  className="font-bold"
                  disabled={!isDirty || isSubmitting}
                  type="submit"
                >
                  {buttonLabel || "作成する"}
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
