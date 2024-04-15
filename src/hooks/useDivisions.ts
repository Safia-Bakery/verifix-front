import { useQuery } from "@tanstack/react-query";
import { DivisionTypes } from "@/utils/types";
import baseApi from "@/api/baseApi";

type Params = {
  from_date: string;
  to_date: string;
  enabled?: boolean;
};

export const useDivisions = ({ enabled = true, ...params }: Params) => {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["divisions"],
    queryFn: () =>
      baseApi
        .get("/divisions", { params })
        .then(({ data: response }) => response as DivisionTypes),
    enabled: !!token && enabled,
  });
};

export default useDivisions;
