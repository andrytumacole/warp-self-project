import { atom, useAtom } from "jotai";

const isModalOpenAtom = atom(false);

export const useCreateChannelModal = () => {
  return useAtom(isModalOpenAtom);
};
