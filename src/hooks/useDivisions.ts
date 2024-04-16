import { useQuery } from "@tanstack/react-query";
import { DivisionTypes } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { replacer, tokenValue } from "@/utils/helper";

type Params = {
  from_date: string;
  to_date: string;
  enabled?: boolean;
};

export const useDivisions = ({
  enabled = true,
  from_date,
  to_date,
}: Params) => {
  const token = localStorage.getItem(tokenValue);
  return useQuery({
    queryKey: ["divisions", from_date, to_date],
    queryFn: () =>
      baseApi
        .get("/divisions", {
          params: {
            from_date: replacer(from_date),
            to_date: replacer(to_date),
          },
        })
        .then(({ data: response }) => response as DivisionTypes),
    enabled: !!token && enabled,
  });
};

export default useDivisions;
