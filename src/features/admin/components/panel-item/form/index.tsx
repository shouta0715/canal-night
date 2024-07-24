"use client";

import { useId } from "react";
import { Control, useController, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeviceInput } from "@/features/admin/schema";

export function CustomForm({
  type,
  name,
  label,
  control,
  defaultValue,
}: {
  type: "string" | "number" | "boolean";
  name: string;
  label: string;
  defaultValue: string | number | boolean;
  control: Control<DeviceInput>;
}) {
  const { register } = useFormContext();
  const id = useId();

  const { field } = useController({
    control,
    name: `custom.${name}`,
    defaultValue,
  });

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {type === "string" && (
        <Input
          className="w-full border border-border"
          defaultValue={defaultValue.toString()}
          id={id}
          type="text"
          {...register(`custom.${name}`)}
        />
      )}
      {type === "number" && (
        <Input
          className="w-full border border-border"
          defaultValue={defaultValue.toString()}
          id={id}
          type="text"
          {...register(`custom.${name}`)}
        />
      )}
      {type === "boolean" && (
        <Select
          defaultValue={defaultValue ? "true" : "false"}
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
