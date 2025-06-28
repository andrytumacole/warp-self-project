import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "../../../../convex/_generated/api";

type Options = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};
function useRemoveWorkspace(options?: Options) {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.remove),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onSettled: options?.onSettled,
  });

  return { mutateAsync, isPending, error };
}

export default useRemoveWorkspace;
