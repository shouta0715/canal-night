import { Node } from "@xyflow/react";
import { UserSession } from "@/features/admin/types";

type CalculateAlignmentProps = {
  nodes: Node<UserSession>[];
  x: number;
  y: number;
  id: string;
};

type CalculateAlignmentReturn = {
  isLeft: boolean;
  isRight: boolean;
  nodes: Node<UserSession>[];
};

export const calculateAlignment = ({
  nodes,
  x,
  y,
  id,
}: CalculateAlignmentProps): CalculateAlignmentReturn => {
  const target = nodes.find((n) => n.id === id);
  if (!target) return { isLeft: false, isRight: false, nodes: [] };

  const { width, height, alignment } = target.data;

  const { startX, startY, endX, endY } = {
    startX: x,
    startY: y,
    endX: x + width,
    endY: y + height,
  };

  let isLeft = true;
  let isRight = true;

  const sameHeightNodes: Node<UserSession>[] = [];

  for (const node of nodes) {
    if (node.id === id) continue;
    const {
      startX: nodeStartX,
      startY: nodeStartY,
      endX: nodeEndX,
      endY: nodeEndY,
    } = node.data.assignPosition;

    const isAllTop =
      startY <= nodeStartY && endY <= nodeEndY && endY >= nodeStartY;
    const isBottomTop = startY >= nodeStartY && endY <= nodeEndY;
    const isTopBottom = startY <= nodeStartY && endY >= nodeEndY;
    const isAllBottom =
      startY >= nodeStartY && endY >= nodeEndY && startY <= nodeEndY;

    const isSameHeight = isAllTop || isBottomTop || isTopBottom || isAllBottom;
    if (!isSameHeight) continue;

    if (startX >= nodeStartX) {
      isLeft = false;
    }

    if (endX <= nodeEndX) {
      isRight = false;
    }

    sameHeightNodes.push(node);
  }

  const isChangedLeft = alignment.isLeft !== isLeft;
  const isChangedRight = alignment.isRight !== isRight;

  if (!isChangedLeft && !isChangedRight) {
    return { isLeft, isRight, nodes: [] };
  }

  const resultNodes: Node<UserSession>[] = [];

  // TODO: ここをリファクタリングs
  for (const node of sameHeightNodes) {
    if (isChangedLeft) {
      const prevLeft = node.data.alignment.isLeft;

      if (prevLeft === isLeft) {
        // 左側を探索
        const newLeft = nodes.find((n) => {
          if (n.id === node.id) return false;
          const {
            startX: nStartX,
            startY: nStartY,
            endX: nEndX,
            endY: nEndY,
          } = n.data.assignPosition;

          return (
            nStartX <= node.data.assignPosition.startX &&
            nEndX >= node.data.assignPosition.startX &&
            nStartY <= node.data.assignPosition.startY &&
            nEndY >= node.data.assignPosition.endY
          );
        });

        const newNode: Node<UserSession> = {
          ...node,
          data: {
            ...node.data,
            alignment: { ...node.data.alignment, isLeft: Boolean(newLeft) },
          },
        };
        resultNodes.push(newNode);
      }
    }

    if (isChangedRight) {
      const prevRight = node.data.alignment.isRight;

      if (prevRight === isRight) {
        const newRight = nodes.find((n) => {
          if (n.id === node.id) return false;
          const {
            startX: nStartX,
            startY: nStartY,
            endX: nEndX,
            endY: nEndY,
          } = n.data.assignPosition;

          return (
            nStartX <= node.data.assignPosition.endX &&
            nEndX >= node.data.assignPosition.endX &&
            nStartY <= node.data.assignPosition.startY &&
            nEndY >= node.data.assignPosition.endY
          );
        });

        const newNode: Node<UserSession> = {
          ...node,
          data: {
            ...node.data,
            alignment: { ...node.data.alignment, isRight: Boolean(newRight) },
          },
        };
        resultNodes.push(newNode);
      }
    }
  }

  return { isLeft, isRight, nodes: resultNodes };
};
