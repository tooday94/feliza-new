import { useQuery } from "@tanstack/react-query";
import { request } from "../../configs/request";

export const useGetList = (endpoint, params = {}, enabled = true) => {
  return useQuery({
    queryKey: [endpoint, params],
    queryFn: async () => {
      const response = await request.get(endpoint, { params });
      return response.data;
    },
    enabled: !!enabled,
    onError: (error) => {
      console.error("Error fetching data:", error);
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
