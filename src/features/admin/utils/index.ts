import { Node } from "reactflow";
import { UserSession } from "@/features/admin/types";

export function sessionToNode(sessions: UserSession[]): Node<UserSession>[] {
  const nodes: Node<UserSession>[] = sessions.map((session) => {
    const { id, width, height, assignPosition, displayname } = session;
    const { startY, startX } = assignPosition;

    return {
      id,
      type: "session",
      data: { id, width, height, assignPosition, displayname },
      position: { x: startX, y: startY },
    };
  });

  return nodes;
}

export function getDefaultNode({
  id,
  width,
  height,
  assignPosition,
  displayname,
}: Omit<UserSession, "role">): Node<UserSession> {
  return {
    id,
    type: "session",
    data: { id, width, height, assignPosition, displayname },
    position: { x: assignPosition.startX, y: assignPosition.startY },
  };
}
