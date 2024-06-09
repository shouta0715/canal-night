import { UserSession } from "@/features/ripples/types";

export interface AdminNode {
  label: string;
  width: number;
  height: number;
}
export type JoinAdminData = {
  action: "join";
} & Omit<UserSession, "role">;

type InteractionAdminData = {
  action: "interaction";
  id: string;
  position: { x: number; y: number };
};

type LeaveAdminData = {
  action: "leave";
  id: string;
};

export type AdminData = JoinAdminData | LeaveAdminData | InteractionAdminData;
