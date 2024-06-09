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
