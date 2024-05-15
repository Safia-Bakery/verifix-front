import MainInput from "@/components/BaseInputs/MainInput";
import Container from "@/components/Container";
import DateRangeBlock from "@/components/DateRangeBlock";
import DownloadExcel from "@/components/DownloadExcel";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import VirtualTable from "@/components/VirtualTable";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import divisionMutation from "@/hooks/mutations/division";
import useDivisions from "@/hooks/useDivisions";
import { handleIdx, yearMonthDate } from "@/utils/helper";
import { successToast } from "@/utils/toast";
import { DivisionType } from "@/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import cl from "classnames";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const Home = () => {
  const { getValues, register, reset } = useForm();
  const start =
    useQueryString("start") || dayjs(new Date()).format(yearMonthDate);
  const {
    data: divisions,
    isLoading,
    isPending,
  } = useDivisions({
    from_date: start,
  });
  const shift = Number(useQueryString("shift"));
  const navigateParams = useNavigateParams();

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
        header: "Приход по графигу",
        cell: ({ row }) => row.original.workers?.division_workers,
      },
      {
        accessorKey: "division_workers",
        header: "Фактическийт приход",
        cell: ({ row }) => row.original.workers?.[shift],
      },
      {
        accessorKey: "came_workers",
        header: "Количество сотрудников за день",
        cell: ({ row }) => row.original?.workers?.came_workers,
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
          <span>
            {(
              getValues(`${row.original.id}`) - row.original?.workers?.[shift]
            ).toString()}
          </span>
        ),
      },
    ],
    [shift]
  );

  useEffect(() => {
    if (divisions?.schedules)
      navigateParams({ shift: Object.keys(divisions?.schedules)?.[1] });
  }, [divisions]);

  useEffect(() => {
    if (divisions?.data.length) {
      const resetVals = divisions?.data?.reduce((acc: any, item) => {
        acc[item?.id!] = item?.limit ?? 0;
        return acc;
      }, {});
      reset(resetVals);
    }
  }, [divisions?.data]);

  return (
    <Container className="h-[94vh] min-h-[580px] relative">
      {(isLoading || isPending) && <Loading />}
      <div className="mx-auto mb-4">
        <h1 className="text-6xl text-center font-bold">Норма Выхода</h1>
        <p className="text-center font-bold">Количество сотрудников</p>
      </div>

      <div className="flex justify-between mb-4">
        <DateRangeBlock />
        <DownloadExcel />
      </div>
      {!!divisions?.data?.length && (
        <VirtualTable
          columns={columns}
          rowClassName={(row) =>
            cl(
              "text-center",
              getValues(`${row.original.id}`) - row.original.workers[shift] < 0
                ? "bg-yellow-100"
                : ""
            )
          }
          data={divisions?.data!}
        />
      )}

      {!isLoading && !divisions?.data.length && <EmptyList />}
    </Container>
  );
};

export default Home;
