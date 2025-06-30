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
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import Thread from "@/components/threads/thread";

export default function WorkspaceIdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //gets the parentMessageId params in the url
  const { parentMessageId, onClose } = usePanel();
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
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex flex-col h-full items-center justify-center gap-y-2 overflow-hidden">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                    <p className="text-sm text-center text-muted-foreground">
                      Validating message ID...
                    </p>
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
