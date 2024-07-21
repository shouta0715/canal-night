import { Node } from "@xyflow/react";
import { UserSession } from "@/features/admin/types";

export function sessionToNode(sessions: UserSession[]): Node<UserSession>[] {
  const nodes: Node<UserSession>[] = sessions.map((session) => {
    const { startY, startX } = session.assignPosition;

    return {
      id: session.id,
      type: "session",
      data: session,
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
  alignment,
}: Omit<UserSession, "role">): Node<UserSession> {
  return {
    id,
    type: "session",
    data: { id, width, height, assignPosition, displayname, alignment },
    position: { x: assignPosition.startX, y: assignPosition.startY },
  };
}
