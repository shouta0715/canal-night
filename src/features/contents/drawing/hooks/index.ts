import React from "react";

export function useDrawing() {
  const [result, setResult] = React.useState<Blob | null>(null);
  const onClear = () => {
    setResult(null);
  };

  return {
    result,
    setResult,
    onClear,
  };
}
