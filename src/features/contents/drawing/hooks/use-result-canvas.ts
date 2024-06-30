import { useMutation } from "@tanstack/react-query";
import { DragHandlers, useAnimationControls } from "framer-motion";
import { useRef } from "react";
import { toast } from "sonner";

type UseResultCanvasProps = {
  result: Blob;
};

const postBlob = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("file", blob);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export function useResultCanvas({ result }: UseResultCanvasProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);

  const animationControls = useAnimationControls();

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: postBlob,
    onError: () => {
      toast.error("アップロードに失敗しました");
    },
    onSuccess: () => {
      toast.success("アップロードしました");
    },
  });

  const dragStartY = useRef(0);

  const onReset = () => {
    if (!ref.current || !imageWrapperRef.current) return;

    animationControls.start({
      y: 0,
    });
  };
  const onDragEnd = () => {
    if (!ref.current || !imageWrapperRef.current) return;

    const imageRect = imageWrapperRef.current.getBoundingClientRect();

    // 100px以上ドラッグしたら画像をアップロード

    if (Math.abs(dragStartY.current - imageRect.top) > 500) {
      if (isPending || isSuccess) return;

      mutateAsync(result);
    } else {
      onReset();
    }
  };

  const onDragStart: DragHandlers["onDragStart"] = (_, info) => {
    if (!info.point) return;
    dragStartY.current = info.point.y;
  };

  return {
    ref,
    imageWrapperRef,
    animationControls,
    isPending,
    isSuccess,
    onReset,
    onDragEnd,
    onDragStart,
  };
}
