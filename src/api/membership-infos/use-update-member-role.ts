import { useMutation } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";

type Options = {
  onSuccess?: () => void;
  onError?: () => void;
  onSettled?: () => void;
};

export const useUpdateMemberRole = (options?: Options) => {
  const { isPending, data, error, mutateAsync } = useMutation({
    mutationFn: useConvexMutation(api.membership_info.update),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
    onSettled: options?.onSettled,
  });

  return { isPending, data, error, mutateAsync };
};
