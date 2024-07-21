import { Position } from "@xyflow/react";

export type Alignment = {
  isLeft: boolean;
  isRight: boolean;
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
  alignment: Alignment;
  connections: Connection[];
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

export type AdminData =
  | JoinAdminData
  | LeaveAdminData
  | InteractionAdminData
  | ResizeAdminData
  | ChangeDeviceAdminData
  | ChangePositionAdminData
  | ChangeDisplaynameAdminData;

export type AssignedPosition = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
