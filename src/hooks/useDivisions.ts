import { useQuery } from "@tanstack/react-query";
import { DivisionTypes } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { tokenValue } from "@/utils/helper";

type Params = {
  from_date: string;
  enabled?: boolean;
};

export const useDivisions = ({ enabled = true, from_date }: Params) => {
  const token = localStorage.getItem(tokenValue);
  return useQuery({
    queryKey: ["divisions", from_date],
    queryFn: () =>
      baseApi
        .get("/v2/divisions", {
          params: {
            from_date,
          },
        })
        .then(({ data: response }) => response as DivisionTypes),
    enabled: !!token && enabled,
  });
};

export default useDivisions;
