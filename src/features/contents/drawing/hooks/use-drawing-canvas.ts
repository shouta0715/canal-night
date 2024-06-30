import { useEffect, useRef, useState } from "react";

type Status = "pen" | "eraser" | "capture";

type DrawingCanvasProps = {
  setResult: (blob: Blob | null) => void;
};

export function useDrawingCanvas({ setResult }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [status, setStatus] = useState<Status>("pen");
  const [isDrawing, setIsDrawing] = useState(false);

  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(5);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const onClear = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    setResult(null);
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);

    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const onPenSizeChange = (v: number[]) => {
    setPenSize(v[0]);
  };

  const onCaptureStart = async () => {
    setStatus("capture");

    const ctx = canvasRef.current?.getContext("2d");

    if (!ctx) return;

    const video = videoRef.current;

    if (!video) return;
    if (!canvasRef.current) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: canvasRef.current.width,
        height: canvasRef.current.height,
      },
    });

    video.srcObject = stream;
    video.play();
  };

  const onCaptureStop = () => {
    setStatus("pen");

    const video = videoRef.current;

    if (!video) return;

    video.pause();
    video.srcObject = null;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    if (!isDrawing) return;

    if (status === "pen") {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }

    if (status === "eraser") {
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY,
        penSize * 3,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.restore();
    }
  };

  const onSave = () => {
    setStatus("pen");
    if (status === "capture") {
      const video = videoRef.current;
      if (!video) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      video.pause();
      video.srcObject = null;
    }
    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.toBlob((blob) => {
      setResult(blob);
    });
  };

  useEffect(() => {
    if (!canvasRef.current || !parentRef.current) return () => {};

    const canvas = canvasRef.current;
    const parent = parentRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const onResize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return {
    canvasRef,
    penColor,
    penSize,
    parentRef,
    status,
    setPenColor,
    setPenSize,
    startDrawing,
    draw,
    stopDrawing,
    onPenSizeChange,
    clearCanvas,
    setStatus,
    onCaptureStart,
    onCaptureStop,
    onSave,
    onClear,
    videoRef,
  };
}
