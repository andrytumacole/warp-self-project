"use client";

import { usePanel } from "@/hooks/use-panel";
import Toolbar from "@/components/home/toolbar";
import Sidebar from "@/components/home/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WorkspaceSidebar from "@/components/workspaces/workspace-sidebar";

export default function WorkspaceIdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //gets the parentMessageId params in the url
  const { parentMessageId, onClose: _ } = usePanel();
  const isPanelShown = !!parentMessageId;

  return (
    <div className="h-full bg-[#f5f5f5]">
      <Toolbar />
      {/* offset by toolbar height */}
      <div className="flex h-[calc(100vh-2.5rem)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={"workspace-layout"}
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className="bg-slate-800 text-white"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20}>{children}</ResizablePanel>
          {isPanelShown && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
