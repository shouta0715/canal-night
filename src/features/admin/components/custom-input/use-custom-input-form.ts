import { valibotResolver } from "@hookform/resolvers/valibot";
import { DeepPartial, useForm } from "react-hook-form";
import {
  CustomInput as TCustomInput,
  customSchema,
} from "@/features/admin/schema";

type UseCustomInputFormProps = {
  defaultValues: DeepPartial<TCustomInput>;
  setOpen?: (open: boolean) => void;
  onError?: (error: unknown) => void;
  submitHandler: (data: TCustomInput) => Promise<void> | void;
};

export function useCustomInputForm({
  defaultValues,
  setOpen,
  onError,
  submitHandler,
}: UseCustomInputFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isSubmitting },
    reset,
  } = useForm<TCustomInput>({
    resolver: valibotResolver(customSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await submitHandler(data);
      reset();
      setOpen?.(false);
    } catch (error) {
      onError?.(error);
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });

  return {
    register,
    control,
    errors,
    isDirty,
    isSubmitting,
    onSubmit,
  };
}
