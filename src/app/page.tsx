"use client";

import UserAvatarButton from "@/components/user/user-avatar-button";
import useGetWorkspaces from "./api/use-get-workspaces";
import { useEffect, useMemo } from "react";
import { useCreateWorkspaceModal } from "./atom-states/use-create-workspace-modal";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-col justify-center h-full items-center">
      <UserAvatarButton />
    </div>
  );
}
