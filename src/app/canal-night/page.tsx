import React from "react";
import { registerActions } from "@/actions/register";
import { Button } from "@/components/ui/button";

export default function Page() {
  const action = registerActions.bind(null, "canal-night");

  return (
    <div className="container mx-auto p-4 text-center">
      <form action={action}>
        <Button>参加する</Button>
      </form>
    </div>
  );
}
