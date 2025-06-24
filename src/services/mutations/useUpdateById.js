import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../configs/request";

export const useUpdateById = (endpoint, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      request.put(`${endpoint}${id}`, data).then((res) => res.data),
    onSuccess: (res) => {
      console.log(`${queryKey} muvaffaqiyatli yangilandi:`, res);
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => {
      console.error(`${queryKey} yangilashda xato:`, error);
    },
  });
};
