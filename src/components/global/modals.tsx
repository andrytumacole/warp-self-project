"use client";

import { useEffect, useState } from "react";
import CreateWorkspaceModal from "../workspaces/workspace-modals/create-workspace-modal";
import CreateChannelModal from "../workspaces/workspace-modals/create-channel-modal";

function Modals() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return; //entire sequence of isMounted is for hydration errors
  //ensures that component is mounted or loaded on the client side

  return (
    <>
      <CreateChannelModal />
      <CreateWorkspaceModal />
    </>
  );
}

export default Modals;
