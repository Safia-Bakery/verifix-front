import { baseURL } from "@/api/baseApi";
import useQueryString from "@/hooks/custom/useQueryString";
import useDivExcell from "@/hooks/useDivExcell";
import { yearMonthDate } from "@/utils/helper";
import dayjs from "dayjs";
import { ChangeEvent, useEffect } from "react";
import Button from "../Button";
import { BtnTypes, SelectValue } from "@/utils/types";
import uploadExcelMutation from "@/hooks/mutations/uploadExcel";
import Loading from "../Loader";
import { errorToast, successToast } from "@/utils/toast";
import useDivisions from "@/hooks/useDivisions";
import getDivisionExcel from "@/hooks/mutations/getDivisionExcel";
import useBackExcel from "@/hooks/custom/useBackExcel";

const DownloadExcel = () => {
  const start =
    useQueryString("start") || dayjs(new Date()).format(yearMonthDate);

  const { mutate, isPending } = uploadExcelMutation();
  const { mutate: getDivExcel, isPending: divExcelPending } =
    getDivisionExcel();
  const { refetch, isFetching } = useDivisions({
    from_date: start,
    enabled: false,
  });

  const {
    data: excelFile,
    isLoading: excellLoading,
    refetch: excellRefetch,
    error,
    isError,
  } = useDivExcell({
    from_date: start,
    enabled: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    mutate(
      { file: e?.target?.files?.[0] },
      {
        onSuccess: () => {
          successToast("Загружен");
          refetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const shiftJson = useQueryString("shifts");
  const shifts = (shiftJson && (JSON.parse(shiftJson) as SelectValue[])) || [];

  const handleDownloadExcel = () => {
    getDivExcel(
      {
        from_date: start,
        ...(!!shifts?.length && { ids: shifts?.map((item) => +item?.value!) }),
      },
      {
        onSuccess: (data) => {
          useBackExcel(data.file);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (isError) errorToast(error.message);
  }, [error, isError]);

  if (excellLoading || isPending || isFetching || divExcelPending)
    return <Loading />;

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
      <Button onClick={handleDownloadExcel} btnType={BtnTypes.green}>
        Скачать Excell
      </Button>
    </div>
  );
};

export default DownloadExcel;
