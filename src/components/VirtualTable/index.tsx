import useQueryString from "@/hooks/custom/useQueryString";
import { DivisionType, SelectValue } from "@/utils/types";
import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Fragment, ReactNode, useRef, useState } from "react";
import MainInput from "../BaseInputs/MainInput";
import divisionMutation from "@/hooks/mutations/division";
import { useForm } from "react-hook-form";
import { successToast } from "@/utils/toast";

type ReturnFunction<Tval> = (smt: Tval) => string;
type RowClassName<T> = string | ReturnFunction<T>;

interface Props<TData> {
  data?: TData[];
  columns: ColumnDef<TData, any>[];
  className?: string;
  children?: ReactNode;
  rowClassName?: RowClassName<Row<TData>>;
}

function VirtualTable<T>({
  data,
  columns,
  className,
  children,
  rowClassName,
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const shifts = useQueryString("shifts");

  const shiftsJson = shifts ? (JSON.parse(shifts) as SelectValue[]) : undefined;

  const { mutate } = divisionMutation();
  const { getValues, register, reset } = useForm();

  const handleIdChange = (id: number) => {
    mutate(
      {
        id,
        limit: getValues(`${id}`),
      },
      { onSuccess: () => successToast("Успешно Изменен") }
    );
  };

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const { rows } = table.getRowModel();

  const parentRef = useRef<HTMLDivElement>(null);

  const handleRowStyles = (item: Row<T>) =>
    typeof rowClassName === "function" ? rowClassName?.(item) : rowClassName;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 300,
  });

  return (
    <div
      ref={parentRef}
      className={`${className} w-full bg-white h-[74vh] overflow-auto`}
    >
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <table className="table table-bordered w-full">
          <thead>
            {data &&
              table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="bg-mainBlack text-white p-2 sticky-header"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: " 🔼",
                              desc: " 🔽",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            {children && <tr>{children}</tr>}
          </thead>

          {!!shiftsJson?.length ? (
            shiftsJson?.map((shift, idx) => (
              <tbody key={idx}>
                <tr className="bg-red-400">
                  <td className="text-center text-lg font-bold" colSpan={6}>
                    {shift.label}
                  </td>
                </tr>
                {virtualizer.getVirtualItems().map((virtualRow, index) => {
                  const row = rows[virtualRow.index] as Row<DivisionType>;

                  return (
                    <tr
                      className={`${
                        getValues(`${row.original.id}`) -
                          row.original.workers[shift.value! as any] <
                        0
                          ? "bg-yellow-100"
                          : ""
                      } border-b border-b-borderGray p-2 text-center`}
                      key={row.id}
                      style={{
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${
                          virtualRow.start - index * virtualRow.size
                        }px)`,
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{row.original?.division}</td>
                      <td>{row.original?.workers?.division_workers}</td>
                      <td>{row.original.workers?.[shift.value! as any]}</td>
                      <td>
                        <MainInput
                          type="number"
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleIdChange(row.original.id)
                          }
                          register={register(`${row.original.id}`)}
                        />
                      </td>
                      <td>
                        {" "}
                        <span>
                          {(
                            getValues(`${row.original.id}`) -
                            row.original?.workers?.[shift.value! as any]
                          ).toString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ))
          ) : (
            <tbody>
              {virtualizer.getVirtualItems().map((virtualRow, index) => {
                const row = rows[virtualRow.index] as Row<T>;
                return (
                  <tr
                    className={`${handleRowStyles(
                      row
                    )} border-b border-b-borderGray p-2`}
                    key={row.id}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${
                        virtualRow.start - index * virtualRow.size
                      }px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="p-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          )}

          {/* <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id} className="sticky-footer">
                {shiftsJson?.map((shift, idx) =>
                  <th>

                  </th>
                )}
              </tr>
            ))}
          </tfoot> */}
        </table>
      </div>
    </div>
  );
}

export default VirtualTable;
