import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";

type Body = {
  from_date?: string;
  ids?: number[];
};

const getDivisionExcel = () => {
  return useMutation({
    mutationKey: ["get_division_exell"],
    mutationFn: async ({ from_date, ...body }: Body) => {
      const { data } = await baseApi.post(
        `/v2/divisions/excell?from_date=${from_date}`,
        body.ids
      );
      return data;
    },
  });
};
export default getDivisionExcel;
