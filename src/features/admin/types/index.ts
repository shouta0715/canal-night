import { Position } from "@xyflow/react";
import { UserCustomInput } from "@/features/admin/schema";

export type Alignment = {
  isLeft: boolean;
  isRight: boolean;
  isTop: boolean;
  isBottom: boolean;
};

export type Connection = {
  source: string;
  target: string;
  from: Position;
  to: Position;
};

export type UserSession = {
  width: number;
  height: number;
  assignPosition: AssignedPosition;
  id: string;
  displayname: string;
  connections: Connection[];
  alignment: Alignment;
  isStartDevice: boolean;
  custom: UserCustomInput;
};

export type EdgeData = {
  from: Position;
  to: Position;
  source: string;
  target: string;
};

export type JoinAdminData = {
  action: "join";
} & Omit<UserSession, "role">;

export type InteractionAdminData = {
  action: "interaction";
  id: string;
  position: { x: number; y: number };
};

export type LeaveAdminData = {
  action: "leave";
  id: string;
};

export type ChangePositionAdminData = {
  action: "position";
  id: string;
  assignPosition: AssignedPosition;
  alignment: Alignment;
};

export type ResizeAdminData = {
  action: "resize";
  id: string;
  width: number;
  height: number;
};

export type ChangeDeviceAdminData = {
  x: number;
  y: number;
  action: "device";
} & UserSession;

export type ChangeDisplaynameAdminData = {
  action: "displayname";
  id: string;
  displayname: string;
};

export type ConnectionAdminData = {
  action: "connection";
  target: UserSession;
  source: UserSession;
};

export type AdminData =
  | JoinAdminData
  | LeaveAdminData
  | InteractionAdminData
  | ResizeAdminData
  | ChangeDeviceAdminData
  | ChangePositionAdminData
  | ChangeDisplaynameAdminData
  | ConnectionAdminData;

export type AssignedPosition = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
