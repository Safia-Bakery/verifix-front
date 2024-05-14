import { useNavigateParams } from "custom/useCustomNavigate";
import dayjs from "dayjs";
import useQueryString from "custom/useQueryString";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { yearMonthDate } from "@/utils/helper";
import Button from "../Button";
import { BtnTypes } from "@/utils/types";
import MainInput from "../BaseInputs/MainInput";
import MainSelect from "../BaseInputs/MainSelect";
import useDivisions from "@/hooks/useDivisions";

const DateRangeBlock = () => {
  // const start = useQueryString("start") || dayjs().format(yearMonthDate);
  // const end = useQueryString("end") || dayjs().format(yearMonthDate);
  const navigateParams = useNavigateParams();
  const { register, getValues, reset, setValue, handleSubmit } = useForm();
  const start =
    useQueryString("start") || dayjs(new Date()).format(yearMonthDate);
  const shift = Number(useQueryString("shift"));
  const { data: divisions } = useDivisions({
    from_date: start,
  });

  const handleDate = () => {
    navigateParams({
      start: getValues("start"),
    });
  };

  useEffect(() => {
    reset({
      start,
    });
  }, [start]);

  return (
    <form className="flex w-max gap-3" onSubmit={handleSubmit(handleDate)}>
      <MainInput
        type="date"
        className="!w-[250px]"
        register={register("start")}
      />

      {/* <MainInput type="date" register={register("end")} /> */}
      <Button btnType={BtnTypes.darkBlue} type="submit" onClick={handleDate}>
        Показать
      </Button>
      <MainSelect
        values={divisions?.schedules}
        value={shift}
        onChange={(shift) => navigateParams({ shift })}
      />
    </form>
  );
};

export default DateRangeBlock;
