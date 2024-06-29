export type UserSession = {
  width: number;
  height: number;
  assignPosition: AssignedPosition;
  id: string;
  displayname: string;
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

type AssignedPosition = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};
