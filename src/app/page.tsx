"use client";

import UserAvatarButton from "@/components/user/user-avatar-button";
import useGetWorkspaces from "../api/workspaces/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useCreateWorkspaceModal();
  const { workspaces, isLoading } = useGetWorkspaces();
  const firstWorkspaceId = useMemo(() => {
    return workspaces?.[0]?._id;
  }, [workspaces]);

  useEffect(() => {
    if (isLoading) return;

    if (firstWorkspaceId) {
      router.replace(`/workspace/${firstWorkspaceId}`);
    }

    if (firstWorkspaceId) {
      console.log("redirect to workspace");
      return;
    }
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  }, [firstWorkspaceId, isLoading, isModalOpen, setIsModalOpen, router]);

  return (
    <div className="flex flex-col justify-center h-full items-center gap-y-2">
      <Loader className="animate-spin size-6" />
      <p className="text-muted-foreground">Fetching you workspace</p>
    </div>
  );
}
