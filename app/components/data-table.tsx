import React from "react";
import {
  getCoreRowModel,
  type ColumnDef,
  type Column,
  flexRender,
  useReactTable,
} from "@tanstack/react-table";
import { makeData, type Person } from "../makeData";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";

// Helper function to compute pinning styles for columns
const getPinningStyles = (column: Column<Person>): React.CSSProperties => {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

const columns: ColumnDef<Person>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] bg-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] bg-white"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,

    size: 50,
    minSize: 50,
    maxSize: 50,
  },
  {
    accessorKey: "firstName",
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: "lastName",
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "age",
    header: () => "Age",
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "visits",
    header: () => <span>Visits</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "status",
    header: "Status",
    footer: (props) => props.column.id,
  },
  {
    accessorKey: "progress",
    header: "Profile Progress",
    footer: (props) => props.column.id,
  },
];

export default function DataTable() {
  const data = React.useMemo(() => makeData(20), []);
  const [selectedCell, setSelectedCell] = React.useState<string | null>(null);

  const table = useReactTable({
    initialState: {
      columnPinning: {
        left: ["select"],
      },
    },
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
  });

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if click is outside of any table cell
      if (!target.closest("td")) {
        setSelectedCell(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="py-10 px-4 md:px-6 lg:px-10 relative">
      <div>
        <div className="w-full overflow-auto relative border rounded-md [&>div]:h-[500px]">
          <Table className="table-fixed w-full caption-bottom text-sm [&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b [&_td]:border-r [&_td]:border-l border">
            <TableHeader className="bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const { column } = header;
                    const isPinned = column.getIsPinned();
                    const isLastLeftPinned =
                      isPinned === "left" && column.getIsLastColumn("left");
                    const isFirstRightPinned =
                      isPinned === "right" && column.getIsFirstColumn("right");
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="truncate [&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/90 relative h-10 border-t data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l bg-white"
                        style={{
                          ...getPinningStyles(column),
                          width: header.getSize(),
                        }}
                        data-pinned={isPinned || undefined}
                        data-last-col={
                          isLastLeftPinned
                            ? "left"
                            : isFirstRightPinned
                            ? "right"
                            : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300 ${
                              header.column.getIsResizing() ? "bg-primary" : ""
                            }`}
                          ></div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="w-full overflow-auto relative">
              {table.getRowModel().rows.map((row) => {
                return (
                  <TableRow className="border" key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      const isPinned = column.getIsPinned();
                      const isLastLeftPinned =
                        isPinned === "left" && column.getIsLastColumn("left");
                      const isFirstRightPinned =
                        isPinned === "right" &&
                        column.getIsFirstColumn("right");
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/90 data-pinned:backdrop-blur-xs [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l bg-white",
                            cell.column.id !== "select" &&
                              "cursor-pointer border border-transparent hover:border-blue-500 hover:bg-blue-50",
                            selectedCell === cell.id &&
                              "!border-blue-500 !border-[1px] hover:bg-white bg-white scale-[1.2] z-50 transition-transform"
                          )}
                          style={{
                            ...getPinningStyles(column),
                            width: cell.column.getSize(),
                            zIndex:
                              selectedCell === cell.id ? 100 : isPinned ? 1 : 0,
                          }}
                          onClick={() =>
                            cell.column.id !== "select" &&
                            setSelectedCell(cell.id)
                          }
                          data-pinned={isPinned || undefined}
                          data-last-col={
                            isLastLeftPinned
                              ? "left"
                              : isFirstRightPinned
                              ? "right"
                              : undefined
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
