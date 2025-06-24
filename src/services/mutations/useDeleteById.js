import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../configs/request";

export const useDeleteById = (endpoint, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      request.delete(`${endpoint}${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error("xato:", error);
    },
  });
};
