"use client";

import React from "react";
import { DrawingCanvas } from "@/features/contents/drawing/components/drawing-canvas";
import { ResultCanvas } from "@/features/contents/drawing/components/result-canvas";
import { useDrawing } from "@/features/contents/drawing/hooks";

const DrawingApp: React.FC = () => {
  const { onClear, setResult, result } = useDrawing();

  return (
    <div className="p-5">
      {result ? (
        <ResultCanvas onClear={onClear} result={result} />
      ) : (
        <DrawingCanvas setResult={setResult} />
      )}
    </div>
  );
};

export default DrawingApp;
