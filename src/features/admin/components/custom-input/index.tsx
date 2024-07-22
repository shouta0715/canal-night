import { Minus, Plus, PlusIcon } from "lucide-react";
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
import { CustomInputFormDialog } from "@/features/admin/components/custom-input/form";
import { CustomInputItem } from "@/features/admin/components/custom-input-item";
import { useNodeStore } from "@/features/admin/components/providers";

export function CustomInput() {
  const store = useNodeStore();

  const { customs, addCustom } = useStore(store, (s) => ({
    customs: s.customs,
    addCustom: s.addCustom,
  }));
  const [open, setOpen] = React.useState(false);

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
        submitHandler={addCustom}
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
