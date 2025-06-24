import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../configs/request";

export const useCreate = (endpoint, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) =>
      await request.post(endpoint, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error("Yaratishda xato yuz berdi:", error);
    },
  });
};
