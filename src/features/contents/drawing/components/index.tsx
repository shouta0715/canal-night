"use client";

import React from "react";
import { DrawingCanvas } from "@/features/contents/drawing/components/drawing-canvas";
import { useDrawing } from "@/features/contents/drawing/hooks";

const DrawingApp: React.FC = () => {
  const { setResult, result } = useDrawing();

  return (
    <div>{result ? <div>a</div> : <DrawingCanvas setResult={setResult} />}</div>
  );
};

export default DrawingApp;
