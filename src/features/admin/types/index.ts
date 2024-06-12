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

type ResizeAdminData = {
  action: "resize";
  id: string;
  width: number;
  height: number;
};

export type AdminData =
  | JoinAdminData
  | LeaveAdminData
  | InteractionAdminData
  | ResizeAdminData;

type AssignedPosition = {
  startWidth: number;
  startHeight: number;
  endWidth: number;
  endHeight: number;
};

export type UserSession = {
  role: "user";
  width: number;
  height: number;
  assignPosition: AssignedPosition;
  id: string;
};
