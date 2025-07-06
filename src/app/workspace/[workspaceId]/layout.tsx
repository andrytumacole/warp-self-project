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
import { Id } from "../../../../convex/_generated/dataModel";
import Thread from "@/components/threads/thread";
import Profile from "@/components/user/profile";

export default function WorkspaceIdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //gets the parentMessageId params in the url
  const { parentMessageId, profileMemberId, onClose } = usePanel();
  const isPanelShown = !!parentMessageId || !!profileMemberId;

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
          <ResizablePanel minSize={20} defaultSize={80}>
            {children}
          </ResizablePanel>
          {isPanelShown && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                <RenderPanelContent
                  isPanelShown={isPanelShown}
                  onClose={onClose}
                  parentMessageId={parentMessageId}
                  profileMemberId={profileMemberId}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

interface RenderPanelContentProps {
  isPanelShown: boolean;
  parentMessageId: string | null;
  onClose: () => void;
  profileMemberId: string | null;
}

function RenderPanelContent(props: Readonly<RenderPanelContentProps>) {
  const { isPanelShown, parentMessageId, onClose, profileMemberId } = props;
  if (!isPanelShown) return;
  if (parentMessageId) {
    return (
      <Thread messageId={parentMessageId as Id<"messages">} onClose={onClose} />
    );
  }
  return (
    <Profile
      profileMemberId={profileMemberId as Id<"membershipInfos">}
      onClose={onClose}
    />
  );
}
