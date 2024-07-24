"use client";

import clsx from "clsx";
import { Cable, CodeXml } from "lucide-react";
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { SwitchRoot, SwitchThumb } from "@/components/ui/switch";
import { CustomInput } from "@/features/admin/components/custom-input";
import { PanelItem } from "@/features/admin/components/panel-item";
import { useAdminPanel } from "@/features/admin/hooks/use-admin-panel";
import { UserSession } from "@/features/admin/types";

const generateKey = (data: UserSession) => {
  const { assignPosition, width, height, custom } = data;

  const cs = custom ? Object.keys(custom).join("-") : "";

  return `${data.id}-${assignPosition.startX}-${assignPosition.startY}-${width}-${height}-${cs}`;
};

export function AdminPanel() {
  const {
    selectedNodeId,
    nodes,
    appName,
    isConnectMode,
    pathname,
    searchParams,
    onChangeMode,
  } = useAdminPanel();

  return (
    <div className="flex h-full flex-col overflow-auto p-4 pb-28">
      <div className="flex">
        <p
          className={clsx(
            "font-semibold",
            isConnectMode ? "text-green-500" : "text-primary"
          )}
        >
          {isConnectMode ? "接続モード" : "表示モード"}
        </p>
        <SwitchRoot
          checked={isConnectMode}
          className="mb-2 ml-auto h-8 w-14 border border-border data-[state=checked]:bg-background data-[state=unchecked]:bg-background"
          onCheckedChange={onChangeMode}
        >
          <SwitchThumb className="pointer-events-none grid size-6 place-items-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-1 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-primary">
            {isConnectMode ? (
              <Cable className="size-4 stroke-white" />
            ) : (
              <CodeXml className="size-4 stroke-white" />
            )}
          </SwitchThumb>
        </SwitchRoot>
      </div>

      <CustomInput />

      <div className="mt-12 space-y-2">
        <p className="text-sm font-semibold">接続されている端末 一覧</p>

        <Accordion defaultValue={[selectedNodeId ?? ""]} type="multiple">
          {nodes.map((node) => {
            const key = generateKey(node.data);

            return (
              <PanelItem
                key={key}
                active={selectedNodeId === node.id}
                appName={appName}
                isConnectMode={isConnectMode}
                pathname={pathname}
                searchParams={searchParams}
                session={node.data}
              />
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
