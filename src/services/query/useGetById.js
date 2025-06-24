import { useQuery } from "@tanstack/react-query";
import { request } from "../../configs/request";

export const useGetById = (endpoint, id, params = {}) => {
  return useQuery({
    queryKey: [endpoint, id],
    queryFn: async () => {
      const response = await request.get(`${endpoint}${id}`, { params });
      return response.data;
    },
    enabled: !!id,
    onError: (error) => {
      console.error(`Error fetching data from ${endpoint}:`, error);
    },
  });
};
