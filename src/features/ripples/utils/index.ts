import { Node } from "reactflow";
import { AdminNode } from "@/features/admin/types";
import { UserSession } from "@/features/ripples/types";

export function sessionToNode(sessions: UserSession[]): Node<AdminNode>[] {
  const nodes: Node<AdminNode>[] = sessions.map((session) => {
    const { id, width, height, assignPosition } = session;
    const { startHeight, startWidth } = assignPosition;

    return {
      id,
      type: "session",
      data: { label: id, width, height },
      position: { x: startWidth, y: startHeight },
    };
  });

  return nodes;
}

export function getDefaultNode({
  id,
  width,
  height,
  assignPosition,
}: Omit<UserSession, "role">): Node<AdminNode> {
  return {
    id,
    type: "session",
    data: { label: id, width, height },
    position: { x: assignPosition.startWidth, y: assignPosition.startHeight },
  };
}
