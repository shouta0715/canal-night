import {
  InferInput,
  boolean,
  integer,
  minValue,
  number,
  object,
  pipe,
} from "valibot";

export const deviceSchema = object({
  width: pipe(
    number("数値を入力してください。"),
    integer("整数を入力してください。"),
    minValue(100, "100以上の値を入力してください。")
  ),
  height: pipe(
    number("数値を入力してください。"),
    integer("整数を入力してください。"),
    minValue(100, "100以上の値を入力してください。")
  ),
  x: pipe(
    number("数値を入力してください。"),
    integer("整数を入力してください。")
  ),
  y: pipe(
    number("数値を入力してください。"),
    integer("整数を入力してください。")
  ),
  isStartDevice: boolean(),
});

export type DeviceInput = InferInput<typeof deviceSchema>;
