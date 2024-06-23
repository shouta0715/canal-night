import { useParams, useSearchParams } from "next/navigation";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { useNodeStore } from "@/features/admin/components/providers";
import { RFState } from "@/features/admin/store";

const selector = (state: RFState) => ({
  nodes: state.nodes,
});

export function useAdminPanel() {
  const store = useNodeStore();
  const { nodes } = useStore(store, useShallow(selector));
  const params = useParams<{ "app-name": string }>();
  const appName = params["app-name"];

  const searchParams = useSearchParams();
  const selectedNodeId = searchParams.get("node") || "";

  return { selectedNodeId, nodes, appName };
}
