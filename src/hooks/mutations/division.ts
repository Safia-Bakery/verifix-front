import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";

type Body = {
  id: number;
  limit: number;
  name?: string;
};

const divisionMutation = () => {
  return useMutation({
    mutationKey: ["update_division"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.put("/division", body);
      return data;
    },
  });
};
export default divisionMutation;
