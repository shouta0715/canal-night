import { useMutation } from "@tanstack/react-query";
import { Minus, Plus, PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { useStore } from "zustand";
import {
  Accordion,
  AccordionButton,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { addCustom } from "@/features/admin/api";
import { CustomInputFormDialog } from "@/features/admin/components/custom-input/form";
import { CustomInputItem } from "@/features/admin/components/custom-input-item";
import { useNodeStore } from "@/features/admin/components/providers";
import { CustomInput as TCustomInput } from "@/features/admin/schema";

export function CustomInput() {
  const store = useNodeStore();

  const { customs, addStoreCustom } = useStore(store, (s) => ({
    customs: s.customs,
    addStoreCustom: s.addCustom,
  }));
  const params = useParams<{ "app-name": string }>();
  const [open, setOpen] = React.useState(false);
  const { mutate } = useMutation({
    onMutate: addCustom,
  });

  const submitHandler = (data: TCustomInput) => {
    mutate({ appName: params["app-name"], data });
    addStoreCustom(data);
  };

  return (
    <div className="mt-8">
      <Button
        className="ml-auto flex h-8 items-center gap-1.5 text-xs font-bold"
        onClick={() => {
          setOpen(true);
        }}
      >
        <PlusIcon size={16} />
        データを追加する
      </Button>
      <CustomInputFormDialog
        open={open}
        setOpen={setOpen}
        submitHandler={submitHandler}
      />
      <Accordion className="mt-4" type="multiple">
        <AccordionItem value="custom">
          <AccordionHeader className=" flex items-center gap-2 py-2">
            <AccordionButton className="flex items-center gap-2 [&[data-state=closed]>#minus]:hidden [&[data-state=open]>#plus]:hidden">
              <Plus id="plus" size={16} />
              <Minus id="minus" size={16} />
              <p className="flex-1">カスタムデータ 一覧</p>
            </AccordionButton>
          </AccordionHeader>
          <AccordionContent className="space-y-4 divide-y-2 ">
            {customs.map((custom) => {
              return (
                <div key={custom.key} className="px-4 py-2">
                  <CustomInputItem custom={custom} />
                </div>
              );
            })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
