import { atom, useAtom } from "jotai";

const isModalOpenAtom = atom(false);

export const useCreateWorkspaceModal = () => {
  return useAtom(isModalOpenAtom);
};
