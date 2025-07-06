import useGetMemberById from "@/api/membership-infos/use-get-member-by-id";
import { Id } from "../../../convex/_generated/dataModel";
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Button } from "../ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useUpdateMemberRole } from "@/api/membership-infos/use-update-member-role";
import { useRemoveMember } from "@/api/membership-infos/use-remove-member";
import useGetCurrentMembershipInfo from "@/api/membership-infos/use-get-current-membership-info";
import useGetWorkspaceId from "@/hooks/use-get-workspace-id";
import ConfirmRemoveUserModal from "./confirm-remove-user-modal";
import { useState } from "react";

interface ProfileProps {
  profileMemberId: Id<"membershipInfos">;
  onClose: () => void;
}

function Profile(props: Readonly<ProfileProps>) {
  const { profileMemberId, onClose } = props;
  const { membershipInfo, isLoading: isFetchingMember } = useGetMemberById({
    id: profileMemberId,
  });

  const [isConfirmRemoveModalOpen, setIsConfirmRemoveModalOpen] =
    useState(false);

  const workspaceId = useGetWorkspaceId();

  const {
    membershipInfo: currMembershipInfo,
    isLoading: isFetchingMembershipInfo,
  } = useGetCurrentMembershipInfo({
    workspaceId: workspaceId,
  });

  const {
    data: updatedMemberId,
    error: updateMemberError,
    isPending: isUpdatingMemberRole,
    mutateAsync: updateMemberRole,
  } = useUpdateMemberRole();

  if (isFetchingMember || isFetchingMembershipInfo) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col h-full items-center justify-center gap-y-2 overflow-hidden">
          <Loader className="size-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-center text-muted-foreground"></p>
        </div>
      </div>
    );
  }

  if (!membershipInfo) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col h-full items-center justify-center gap-y-2 overflow-hidden">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground">
            Profile does not exist
          </p>
        </div>
      </div>
    );
  }

  const avatarFallbackContent = membershipInfo.user.name?.[0] ?? "M";

  return (
    <div className="h-full flex flex-col">
      <div className="h-[49px] flex justify-between items-center px-4 border-b">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size={"iconSm"} variant={"ghost"}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col p-4 items-center justify-center overflow-hidden">
        <Avatar className=" hover:opacity-75 transition rounded-lg max-h-[250px] max-w-[250px] size-full">
          <AvatarImage
            src={membershipInfo.user.image}
            alt="User"
            className="rounded-lg"
          />
          <AvatarFallback className="text-white bg-sky-500 text-6xl rounded-lg aspect-square">
            {avatarFallbackContent}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-col flex p-4">
        <p className="text-xl font-bold">{membershipInfo.user.name}</p>
        {currMembershipInfo?.role === "admin" &&
        currMembershipInfo._id !== profileMemberId ? (
          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" className="w-full capitalize">
              {membershipInfo.role}
              <ChevronDownIcon className="size-4 ml-2" />
            </Button>
            <ConfirmRemoveUserModal
              membershipInfoId={profileMemberId}
              isOpen={isConfirmRemoveModalOpen}
              setIsOpen={setIsConfirmRemoveModalOpen}
              type="Remove"
            />
          </div>
        ) : (
          currMembershipInfo?._id === profileMemberId &&
          currMembershipInfo.role !== "admin" && (
            <div className="mt-4">
              <ConfirmRemoveUserModal
                membershipInfoId={profileMemberId}
                isOpen={isConfirmRemoveModalOpen}
                setIsOpen={setIsConfirmRemoveModalOpen}
                type="Leave"
              />
            </div>
          )
        )}
      </div>
      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact information</p>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <MailIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted-foreground">
              Email address
            </p>
            <Link
              href={`mailto:${membershipInfo.user.email}`}
              className="text-sm hover:underline text-[#1264a3]"
            >
              Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
