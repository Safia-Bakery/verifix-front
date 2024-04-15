import { useNavigateParams } from "custom/useCustomNavigate";
import dayjs from "dayjs";
import useQueryString from "custom/useQueryString";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { yearMonthDate } from "@/utils/helper";
import Button from "../Button";
import { BtnTypes } from "@/utils/types";
import MainInput from "../BaseInputs/MainInput";

const DateRangeBlock = () => {
  const start = useQueryString("start") || dayjs().format(yearMonthDate);
  const end = useQueryString("end") || dayjs().format(yearMonthDate);
  const navigateParams = useNavigateParams();
  const { register, getValues, reset, setValue, handleSubmit } = useForm();

  const handleDate = () => {
    const { end, start } = getValues();

    navigateParams({
      end,
      start,
    });
  };

  useEffect(() => {
    reset({
      end: end ?? new Date(),
      start: start ?? new Date(),
    });
  }, [end, start]);

  return (
    <form className="flex w-min gap-3 mb-4" onSubmit={handleSubmit(handleDate)}>
      <MainInput type="date" register={register("start")} />
      <MainInput type="date" register={register("end")} />
      <Button btnType={BtnTypes.darkBlue} type="submit" onClick={handleDate}>
        {"Показать"}
      </Button>
    </form>
  );
};

export default DateRangeBlock;
