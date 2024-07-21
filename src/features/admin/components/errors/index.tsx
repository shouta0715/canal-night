import React from "react";

type ErrorMessageProps = {
  children: React.ReactNode;
};

export function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <p aria-live="assertive" className="text-sm text-destructive">
      {children}
    </p>
  );
}
