"use client";

import Toolbar from "@/components/workspaces/toolbar";
import Sidebar from "@/components/workspaces/sidebar";

export default function WorkspaceIdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full bg-[#f5f5f5]">
      <Toolbar />
      {/* offset by toolbar height */}
      <div className="flex h-[calc(100vh-2.5rem)]">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
