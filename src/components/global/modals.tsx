"use client";

import { useEffect, useState } from "react";
import CreateWorkspaceModal from "../workspaces/create-workspace-modal";

function Modals() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return; //entire sequence of isMounted is for hydration errors
  //ensures that component is mounted or loaded on the client side

  return <CreateWorkspaceModal />;
}

export default Modals;
