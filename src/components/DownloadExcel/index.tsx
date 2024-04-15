import { baseURL } from "@/api/baseApi";
import useQueryString from "@/hooks/custom/useQueryString";
import useDivExcell from "@/hooks/useDivExcell";
import { yearMonthDate } from "@/utils/helper";
import dayjs from "dayjs";
import { ChangeEvent, useEffect } from "react";
import Button from "../Button";
import { BtnTypes } from "@/utils/types";
import uploadExcelMutation from "@/hooks/mutations/uploadExcel";
import Loading from "../Loader";
import { successToast } from "@/utils/toast";
import useDivisions from "@/hooks/useDivisions";

const DownloadExcel = () => {
  const start = useQueryString("start") || dayjs().format(yearMonthDate);
  const end = useQueryString("end") || dayjs().format(yearMonthDate);

  const { mutate, isPending } = uploadExcelMutation();
  const { refetch, isFetching } = useDivisions({
    from_date: start,
    to_date: end,
    enabled: false,
  });

  const {
    data: excelFile,
    isLoading: excellLoading,
    refetch: excellRefetch,
  } = useDivExcell({
    from_date: start,
    to_date: end,
    enabled: false,
  });

  useEffect(() => {
    if (excelFile && excelFile?.file_name) {
      const url = `${baseURL}/files/${excelFile.file_name}`;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [excelFile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    mutate(
      { file: e?.target?.files?.[0] },
      {
        onSuccess: () => {
          successToast("Загружен");
          refetch();
        },
      }
    );
  };

  if (excellLoading || isPending || isFetching) return <Loading />;

  return (
    <div className="flex gap-2">
      <Button btnType={BtnTypes.brown} className="relative cursor-pointer">
        <input
          onChange={handleChange}
          type="file"
          className="absolute inset-0 opacity-0 z-10 cursor-pointer"
        />
        Загрузить Excell
      </Button>
      <Button onClick={() => excellRefetch()} btnType={BtnTypes.green}>
        Скачать Excell
      </Button>
    </div>
  );
};

export default DownloadExcel;
