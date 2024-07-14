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
import { DivisionType, DivisionTypes, SelectValue } from "@/utils/types";
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
  const shiftJson = useQueryString("shifts");
  const shifts = (shiftJson && (JSON.parse(shiftJson) as SelectValue[])) || [];
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
        accessorKey: "name",
        header: "Отдел",
      },
      {
        accessorKey: "came_workers",
        header: "Штатка",
        cell: ({ row }) => row.original?.came_workers,
        footer: (info) =>
          info.table
            .getPreFilteredRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original?.came_workers || 0),
              0
            ),
      },
      {
        accessorKey: "division_workers",
        header: "Фактическийт приход",
        cell: ({ row }) => row.original.division_workers,
        footer: (info) =>
          info.table
            .getPreFilteredRowModel()
            .rows.reduce(
              (sum, row) => sum + (row.original.division_workers || 0),
              0
            ),
      },
      {
        accessorKey: "id",
        header: "Норма Выхода",
        footer: (info) =>
          info.table
            .getPreFilteredRowModel()
            .rows.reduce(
              (sum, row) => sum + (+getValues(`${row.original.id}`) || 0),
              0
            ),
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
        accessorKey: "came_workers",
        header: "Разница",
        footer: (info) =>
          info.table
            .getPreFilteredRowModel()
            .rows.reduce(
              (sum, row) =>
                sum +
                (getValues(`${row.original.id}`) - row.original.came_workers ||
                  0),
              0
            ),
        cell: ({ row }) => (
          <span>
            {(
              getValues(`${row.original.id}`) - row.original?.came_workers
            ).toString()}
          </span>
        ),
      },
    ],
    []
  );

  // useEffect(() => {
  //   if (!!divisions?.timesheets?.length) {
  //     navigateParams({ shifts: 0 });
  //   }
  // }, [divisions?.timesheets]);

  const getList = useMemo(() => {
    return divisions?.timesheets?.filter((item) =>
      shifts?.find((shift) => item.id === shift.value)
    );
  }, [divisions?.timesheets, shifts]);

  useEffect(() => {
    if (divisions?.timesheets?.length) {
      const resetVals = divisions?.timesheets?.map((timesheet) =>
        timesheet?.divisions?.reduce((acc: any, item) => {
          acc[item?.id!] = item?.limit ?? 0;
          return acc;
        }, {})
      );
      reset(resetVals);
    }
  }, [divisions?.timesheets]);

  if (isLoading || isPending) return <Loading />;

  return (
    <Container className="h-min min-h-[580px] relative">
      <div className="mx-auto mb-4">
        <h1 className="text-6xl text-center font-bold">Норма Выхода</h1>
        <p className="text-center font-bold">Количество сотрудников</p>
      </div>

      <div className="flex justify-between mb-4">
        <DateRangeBlock />
        <DownloadExcel />
      </div>
      {getList?.map((list, idx) => (
        <VirtualTable
          shift={list.name}
          key={list.id + idx}
          columns={columns}
          rowClassName={(row) =>
            cl(
              "text-center",
              getValues(`${row.original}`) - row.original?.came_workers < 0
                ? "bg-yellow-100"
                : ""
            )
          }
          data={list.divisions}
        />
      ))}

      {!isLoading && !getList?.length && <EmptyList />}
    </Container>
  );
};

export default Home;
