import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/baseApi";
import { errorToast } from "@/utils/toast";

const uploadExcelMutation = () => {
  const contentType = "multipart/form-data";

  return useMutation({
    mutationKey: ["upload_excell"],
    mutationFn: (body: { file: any }) =>
      baseApi
        .put("/divisions/excell", body, {
          headers: { "Content-Type": contentType },
        })
        .then(({ data }) => data as any),

    onError: (e) => errorToast(e.message),
  });
};
export default uploadExcelMutation;
