"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { useResultCanvas } from "@/features/contents/drawing/hooks/use-result-canvas";

type ResultCanvasProps = {
  result: Blob;
  onClear: () => void;
};

export function ResultCanvas({ result, onClear }: ResultCanvasProps) {
  const {
    ref,
    imageWrapperRef,
    animationControls,
    onReset,
    onDragEnd,
    onDragStart,
    isPending,
    isSuccess,
  } = useResultCanvas({ result });

  return (
    <div className="-m-5 flex h-dvh flex-col items-center justify-center">
      <p className="mb-6 text-center text-2xl font-bold">
        上に弾いてアップロード！！！！！！
      </p>
      <div
        ref={ref}
        className="w-5/6 overflow-hidden rounded-md border-2 border-primary py-40"
      >
        <motion.div
          ref={imageWrapperRef}
          animate={animationControls}
          className="relative mx-auto size-72 overflow-hidden rounded-full border-2 md:size-96"
          drag="y"
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
        >
          <Image
            alt="Drawing result"
            className="pointer-events-none"
            fill
            sizes="(min-width: 640px) 640px, 100vw"
            src={URL.createObjectURL(result)}
          />
        </motion.div>
      </div>

      <div className="mt-10 flex items-center gap-6">
        <Button disabled={isPending || isSuccess} onClick={onReset}>
          {isPending ? "アップロード中" : "元の位置に戻す"}
        </Button>
        <Button
          disabled={isPending || isSuccess}
          onClick={onClear}
          variant="destructive"
        >
          {isPending ? "アップロード中" : "書き直す"}
        </Button>
      </div>
    </div>
  );
}
