import { Edge, Node, Position } from "@xyflow/react";
import { EDGE_TYPE } from "@/features/admin/constant";
import { EdgeData, UserSession } from "@/features/admin/types";

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
  assignPosition,
  ...data
}: Omit<UserSession, "role">): Node<UserSession> {
  return {
    id,
    type: "session",
    data: {
      id,
      assignPosition,
      ...data,
    },
    position: { x: assignPosition.startX, y: assignPosition.startY },
  };
}

export const getEdgeDirection = (direction: string): Position => {
  switch (direction) {
    case "top":
      return Position.Top;
    case "bottom":
      return Position.Bottom;
    case "left":
      return Position.Left;
    case "right":
      return Position.Right;
    default:
      throw new Error("Invalid direction");
  }
};

export const createEdgeId = ({
  source,
  target,
  from,
  to,
}: {
  source: string;
  target: string;
  from: Position;
  to: Position;
}) => {
  return `${source}+${target}-${from}->${to}`;
};

export function sessionToEdge(sessions: UserSession[]): Edge<EdgeData>[] {
  const edges: Edge<EdgeData>[] = [];

  for (const session of sessions) {
    for (const connection of session.connections) {
      const { source, target } = connection;
      const from = getEdgeDirection(connection.from);
      const to = getEdgeDirection(connection.to);

      edges.push({
        id: createEdgeId({
          source,
          target,
          from,
          to,
        }),
        sourceHandle: `${source}-${from}`,
        targetHandle: `${target}-${to}`,
        source,
        target,
        type: EDGE_TYPE,
        data: {
          from,
          to,
          source,
          target,
        },
      });
    }
  }

  return edges.flat();
}
