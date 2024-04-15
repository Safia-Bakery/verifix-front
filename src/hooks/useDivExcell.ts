import { useQuery } from "@tanstack/react-query";
import { DivisionTypes } from "@/utils/types";
import baseApi from "@/api/baseApi";
import { replacer } from "@/utils/helper";

type Params = {
  from_date: string;
  to_date: string;
  enabled?: boolean;
};

export const useDivExcell = ({
  enabled = true,
  from_date,
  to_date,
}: Params) => {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["divisions_excell"],
    queryFn: () =>
      baseApi
        .get("/divisions/excell", {
          params: {
            from_date: replacer(from_date),
            to_date: replacer(to_date),
          },
        })
        .then(({ data: response }) => response as { file_name: string }),
    enabled: !!token && enabled,
  });
};

export default useDivExcell;
