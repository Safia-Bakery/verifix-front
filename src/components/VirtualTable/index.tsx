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
import { ReactNode, useRef, useState } from "react";

type ReturnFunction<Tval> = (smt: Tval) => string;
type RowClassName<T> = string | ReturnFunction<T>;

interface Props<TData> {
  data?: TData[];
  columns: ColumnDef<TData, any>[];
  className?: string;
  children?: ReactNode;
  rowClassName?: RowClassName<Row<TData>>;
  shift?: string;
}

function VirtualTable<T>({
  data,
  columns,
  className,
  children,
  rowClassName,
  shift,
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

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
              table.getHeaderGroups().map((headerGroup, idx) => (
                <tr key={headerGroup.id + idx}>
                  {headerGroup.headers.map((header, hIdx) => {
                    return (
                      <th
                        key={header.id + hIdx}
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
          <tbody>
            <tr>
              <td
                colSpan={6}
                className="text-center bg-gray-500 text-white font-bold"
              >
                {shift}
              </td>
            </tr>
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index] as Row<T>;
              return (
                <tr
                  className={`${handleRowStyles(
                    row
                  )} border-b border-b-borderGray p-2`}
                  key={row.id + index}
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell, cIdx) => {
                    return (
                      <td key={cell.id + cIdx} className="p-2">
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

          <tfoot>
            {table.getFooterGroups().map((footerGroup, idx) => (
              <tr key={footerGroup.id + idx} className="sticky-footer">
                {footerGroup.headers.map((header, fhIdx) => (
                  <th key={header.id + fhIdx}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default VirtualTable;
