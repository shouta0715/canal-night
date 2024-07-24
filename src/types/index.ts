import { Mode } from "@/features/admin/store";
import { Alignment, AssignedPosition } from "@/features/admin/types";

export type Direction = "left" | "right" | "top" | "bottom";

export type ContentProps = {
  initialMode: Mode;
  id: string;
};

export type UserState<T extends object = object> = {
  width: number;
  height: number;
  displayname: string;
  assignPosition: AssignedPosition;
  alignment: Alignment;
  id: string;
  role: "user";
  custom?: Partial<T>;
};

export type ActionPosition = {
  action: "position";
  x: number;
  y: number;
  alignment: Alignment;
  assignPosition: AssignedPosition;
};

export type ActionMode = {
  action: "mode";
  mode: Mode;
};

export type ActionImage = {
  action: "uploaded";
  id: string;
};
