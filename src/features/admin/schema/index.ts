import {
  BooleanSchema,
  CustomSchema,
  InferInput,
  StringSchema,
  array,
  boolean,
  custom,
  integer,
  maxLength,
  minLength,
  minValue,
  number,
  object,
  picklist,
  pipe,
  record,
  safeParse,
  string,
  transform,
  trim,
  union,
  variant,
} from "valibot";

const keySchema = pipe(
  string("文字列を入力してください。"),
  trim(),
  minLength(1, "1文字以上の文字列を入力してください。"),
  maxLength(30, "30文字以下の文字列を入力してください。"),
  custom(
    (value) => {
      if (typeof value !== "string") return false;

      const isEnglish = /^[a-zA-Z0-9_]+$/.test(value);

      if (!isEnglish) return false;
      if (value === "width") return false;
      if (value === "height") return false;
      if (value === "x") return false;
      if (value === "y") return false;

      return true;
    },
    (v) => {
      if (typeof v.input !== "string") return "文字列を入力してください。";
      const isEnglish = /^[a-zA-Z0-9_]+$/.test(v.input);

      if (!isEnglish) return "英数字とアンダースコアのみ使用できます。";

      return `${v.input}は予約語です。`;
    }
  )
);

const labelSchema = pipe(
  string("ラベルを入力してください。"),
  trim(),
  minLength(1, "1文字以上の文字列を入力してください。"),
  maxLength(30, "30文字以下の文字列を入力してください。")
);

const stringSchema = object({
  key: keySchema,
  type: picklist(["string"]),
  label: labelSchema,
  defaultValue: string("初期値の文字列を入力してください。"),
});

const numberSchema = object({
  key: keySchema,
  type: picklist(["number"]),
  label: labelSchema,
  defaultValue: pipe(
    string(),
    transform(Number),
    number("数値を入力してください。")
  ),
});

const booleanSchema = object({
  key: keySchema,
  type: picklist(["boolean"]),
  label: labelSchema,
  defaultValue: boolean(),
});

export const customSchema = variant("type", [
  stringSchema,
  numberSchema,
  booleanSchema,
]);

export const customsSchema = array(customSchema);
const userCustomSchema = record(
  string(),
  union([string(), number(), boolean()])
);

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
  custom: userCustomSchema,
});

export type DeviceInput = InferInput<typeof deviceSchema>;
export type CustomInput = InferInput<typeof customSchema>;
export type CustomsInput = InferInput<typeof customsSchema>;
export type UserCustomInput = InferInput<typeof userCustomSchema>;

export const createUserCustomSchema = <T extends CustomsInput>(customs: T) => {
  const resultSchema = object(
    customs.reduce(
      (acc, c) => {
        if (c.type === "string") {
          acc[c.key] = string("文字列を入力してください");
        }

        if (c.type === "number") {
          acc[c.key] = custom((v) => {
            const parsed = safeParse(number(), Number(v));

            return parsed.success;
          }, "数値を入力してください");
        }

        if (c.type === "boolean") {
          acc[c.key] = boolean("真偽値を入力してください");
        }

        return acc;
      },
      {} as Record<
        string,
        | StringSchema<"文字列を入力してください">
        | CustomSchema<unknown, "数値を入力してください">
        | BooleanSchema<"真偽値を入力してください">
      >
    )
  );

  return object({
    ...deviceSchema.entries,
    custom: resultSchema,
  });
};
