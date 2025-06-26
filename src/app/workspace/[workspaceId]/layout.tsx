"use client";

import Toolbar from "@/components/workspaces/toolbar";

export default function WorkspaceIdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full bg-[#f5f5f5]">
      <Toolbar />
      {children}
    </div>
  );
}
