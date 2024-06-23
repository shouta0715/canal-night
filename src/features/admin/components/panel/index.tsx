"use client";

import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { PanelItem } from "@/features/admin/components/panel-item";
import { useAdminPanel } from "@/features/admin/hooks/use-admin-panel";
import { UserSession } from "@/features/admin/types";

const generateKey = (data: UserSession) => {
  const { assignPosition, width, height } = data;

  return `${data.id}-${assignPosition.startWidth}-${assignPosition.startHeight}-${width}-${height}`;
};

export function AdminPanel() {
  const { selectedNodeId, nodes, appName } = useAdminPanel();

  return (
    <div className="p-4">
      <Accordion defaultValue={[selectedNodeId ?? ""]} type="multiple">
        {nodes.map((node) => {
          const key = generateKey(node.data);

          return (
            <PanelItem
              key={key}
              active={selectedNodeId === node.id}
              appName={appName}
              session={node.data}
            />
          );
        })}
      </Accordion>
    </div>
  );
}
