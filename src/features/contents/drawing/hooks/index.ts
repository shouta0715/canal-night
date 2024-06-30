import React from "react";

export function useDrawing() {
  const [result, setResult] = React.useState<Blob | null>(null);

  return {
    result,
    setResult,
  };
}
