"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  const { signOut } = useAuthActions();
  async function handleLogOut() {
    await signOut();
  }

  return (
    <div className="flex flex-col justify-center h-full items-center">
      Logged in!!
      <Button onClick={() => handleLogOut()}>Log out</Button>
    </div>
  );
}
