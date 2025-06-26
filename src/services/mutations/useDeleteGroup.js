import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../configs/request";

export const useDeleteGroup = (endpoint, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      request.delete(endpoint, { data }).then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },

    onError: (error) => {
      console.error("xato:", error);
    },
  });
};
