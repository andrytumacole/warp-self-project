import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function useGetCurrentUser() {
  const currUser = useQuery(api.users.current);
  const isLoading = currUser === undefined;
  return { currUser, isLoading };
}

export default useGetCurrentUser;
