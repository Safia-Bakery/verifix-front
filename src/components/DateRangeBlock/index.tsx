import { useEffect } from "react";
import dayjs from "dayjs";
import { useNavigateParams } from "custom/useCustomNavigate";
import { useForm } from "react-hook-form";
import useQueryString from "custom/useQueryString";
import { yearMonthDate } from "@/utils/helper";
import Button from "../Button";
import { BtnTypes, SelectValue } from "@/utils/types";
import MainInput from "../BaseInputs/MainInput";
import useDivisions from "@/hooks/useDivisions";
import CustomReactSelect from "../BaseInputs/CustomReactSelect";

const DateRangeBlock = () => {
  const navigateParams = useNavigateParams();
  const { register, getValues, reset, setValue, handleSubmit } = useForm();
  const start =
    useQueryString("start") || dayjs(new Date()).format(yearMonthDate);
  const shifts = useQueryString("shifts");

  const statusJson = shifts ? (JSON.parse(shifts) as SelectValue[]) : undefined;

  const { data: divisions } = useDivisions({
    from_date: start,
    enabled: false,
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

      <Button btnType={BtnTypes.darkBlue} type="submit" onClick={handleDate}>
        Показать
      </Button>

      <CustomReactSelect
        data={divisions?.schedules}
        value={statusJson}
        onChange={(e) => navigateParams({ shifts: JSON.stringify(e) })}
      />
    </form>
  );
};

export default DateRangeBlock;
