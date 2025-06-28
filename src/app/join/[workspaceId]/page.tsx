"use client";

import { useRouter } from "next/navigation";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import useGetWorkspaceInfoById from "@/api/workspaces/use-get-workspace-info-by-id";
import { useJoinWorkspace } from "@/api/membership-infos/use-join-workspace";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import VerificationInput from "react-verification-input";
import { Loader } from "lucide-react";
import { toast } from "sonner";

function JoinPage() {
  const router = useRouter();
  const workspaceId = useGetWorkspaceId();
  const { data: workspaceInfo, isLoading: isFetchingWorkspaceInfo } =
    useGetWorkspaceInfoById({
      id: workspaceId,
    });
  const {
    data: _data,
    isPending,
    mutateAsync,
    error,
  } = useJoinWorkspace({
    onSuccess: handleSuccess,
    onError: handleError,
    onSettled: handleSettled,
  });

  function handleSuccess() {
    console.log("successfully joined workspace");
    toast("Successfully joined workspace!", {
      description: workspaceInfo?.workspaceName,
    });
    router.replace(`/workspace/${workspaceId}`);
  }

  function handleError() {
    console.log("Something went wrong in joining the workspace");
    console.log("error: " + error);
    toast.error("Something went wrong in joining the workspace", {
      description: "Are you sure you entered the right code?",
    });
  }

  function handleSettled() {
    console.log("Finished! You can now proceed");
  }

  async function handleJoin(value: string) {
    const _res = await mutateAsync({
      joinCode: value,
      workspaceId: workspaceId,
    });
  }

  return isFetchingWorkspaceInfo ? (
    <div className="h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  ) : (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src={""} alt="Logo" width={60} height={60} />
      <div className="flex flex-col gap-y-4  items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1>Join {workspaceInfo?.workspaceName}</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          onComplete={handleJoin}
          length={6}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white tex+t-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
        />
      </div>
      <div>
        <Button size={"lg"} variant={"outline"} asChild>
          <Link href={"/"}>Go back to home</Link>
        </Button>
      </div>
    </div>
  );
}

export default JoinPage;
