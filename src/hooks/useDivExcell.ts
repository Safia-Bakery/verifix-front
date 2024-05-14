import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";
import { tokenValue } from "@/utils/helper";

type Params = {
  from_date: string;
  // to_date: string;
  enabled?: boolean;
};

export const useDivExcell = ({
  enabled = true,
  from_date,
}: // to_date,
Params) => {
  const token = localStorage.getItem(tokenValue);
  return useQuery({
    queryKey: ["divisions_excell", from_date],
    queryFn: () =>
      baseApi
        .get("/divisions/excell", {
          params: {
            from_date,
          },
        })
        .then(({ data: response }) => response as { file_name: string }),
    enabled: !!token && enabled,
  });
};

export default useDivExcell;
