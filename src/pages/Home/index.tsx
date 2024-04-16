import MainInput from "@/components/BaseInputs/MainInput";
import Container from "@/components/Container";
import DateRangeBlock from "@/components/DateRangeBlock";
import DownloadExcel from "@/components/DownloadExcel";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import VirtualTable from "@/components/VirtualTable";
import useQueryString from "@/hooks/custom/useQueryString";
import divisionMutation from "@/hooks/mutations/division";
import useDivisions from "@/hooks/useDivisions";
import { handleIdx, yearMonthDate } from "@/utils/helper";
import { successToast } from "@/utils/toast";
import { DivisionType } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const Home = () => {
  const { getValues, register, reset } = useForm();
  const start = useQueryString("start") || dayjs().format(yearMonthDate);
  const end = useQueryString("end") || dayjs().format(yearMonthDate);

  const { data: divisions, isLoading } = useDivisions({
    from_date: start,
    to_date: end,
  });

  const { mutate } = divisionMutation();

  const handleIdChange = (id: number) => {
    mutate(
      {
        id,
        limit: getValues(`${id}`),
      },
      { onSuccess: () => successToast("Успешно Изменен") }
    );
  };

  const columns = useMemo<ColumnDef<DivisionType>[]>(
    () => [
      {
        cell: ({ row }) => <div className="w-4">{handleIdx(row.index)}</div>,
        header: "№",
        size: 5,
      },

      {
        accessorKey: "division",
        header: "Отдел",
      },
      {
        accessorKey: "workers",
        header: "Количество сотрудников",
      },
      {
        accessorKey: "norm",
        header: "Норма Выхода",
        cell: ({ row }) => (
          <MainInput
            type="number"
            onKeyDown={(e) =>
              e.key === "Enter" && handleIdChange(row.original.id)
            }
            register={register(`${row.original.id}`)}
          />
        ),
      },
      {
        accessorKey: "range",
        header: "Разница",
        cell: ({ row }) => (
          <span className="">
            {getValues(`${row.original.id}`) - row.original.workers}
          </span>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    if (divisions?.data.length) {
      const resetVals = divisions?.data?.reduce((acc: any, item) => {
        acc[item?.id!] = item?.limit ?? 0;
        return acc;
      }, {});
      reset(resetVals);
    }
  }, [divisions?.data]);

  if (isLoading) return <Loading />;

  return (
    <Container className="h-[85vh] min-h-[580px] relative">
      <div className="mx-auto mb-4">
        <h1 className="text-6xl text-center font-bold">Норма Выхода</h1>
        <p className="text-center font-bold">Количество сотрудников</p>
      </div>

      <div className="flex justify-between mb-4">
        <DateRangeBlock />
        <DownloadExcel />
      </div>
      {!!divisions?.data.length && (
        <VirtualTable
          columns={columns}
          rowClassName={"text-center"}
          data={divisions?.data!}
        />
      )}

      {!isLoading && !divisions?.data.length && <EmptyList />}
    </Container>
  );
};

export default Home;
