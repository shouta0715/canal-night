import { Mode } from "@/features/admin/store";
import { Alignment, AssignedPosition } from "@/features/admin/types";

export type ContentProps = {
  initialMode: Mode;
  id: string;
};

export type UserState = {
  width: number;
  height: number;
  displayname: string;
  assignPosition: AssignedPosition;
  alignment: Alignment;
  id: string;
  role: "user";
};
