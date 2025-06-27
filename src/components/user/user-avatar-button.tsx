"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthActions } from "@convex-dev/auth/react";
import useGetCurrentUser from "@/app/api/use-current-user";
import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

function UserAvatarButton() {
  const { signOut } = useAuthActions();
  const { currUser, isLoading } = useGetCurrentUser();
  const router = useRouter();

  if (!currUser) {
    return;
  }

  const { image, name } = currUser;
  const avatarFallbackContent = name!.charAt(0).toUpperCase();

  async function handleLogOut() {
    await signOut();
    router.replace("/");
  }
  return (
    <>
      {!isLoading ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="outline-none relative">
            <Avatar className="size-10 hover:opacity-75 transition">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback className="text-white bg-sky-500 text-sm">
                {avatarFallbackContent}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="right" className="w-60">
            <DropdownMenuItem
              onClick={() => handleLogOut()}
              className="w-full flex justify-start hover:bg-gray-300"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Loader className="size-4 animate-spin text-muted-foreground" />
      )}
    </>
  );
}

export default UserAvatarButton;
