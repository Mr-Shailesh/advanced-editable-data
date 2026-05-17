"use client";

import { CSSProperties, useMemo } from "react";
import { List } from "react-window";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSortField } from "@/lib/slices/tableSlice";
import { TableRow } from "@/lib/slices/tableSlice";
import { ChevronUp, ChevronDown } from "lucide-react";
import { EditableTableRow } from "./EditableTableRow";

interface DataTableProps {
  data: TableRow[];
  height?: number;
  virtualized?: boolean;
}

interface VirtualRowProps {
  rows: TableRow[];
}

const COMPACT_ROW_HEIGHT = 53;
const EDITING_ROW_HEIGHT = 54;

const columns = [
  { field: "name", label: "Name", className: "w-[220px]" },
  { field: "email", label: "Email", className: "w-[300px]" },
  { field: "department", label: "Department", className: "w-[200px]" },
  { field: "status", label: "Status", className: "w-[200px]" },
  { field: "salary", label: "Salary", className: "w-[180px]" },
  { field: "hireDate", label: "Hire Date", className: "w-[130px]" },
];

function VirtualTableRow({
  index,
  rows,
  style,
}: {
  index: number;
  rows: TableRow[];
  style: CSSProperties;
}) {
  const row = rows[index];

  if (!row) return null;

  return (
    <div style={style} className="min-w-[1480px]">
      <EditableTableRow row={row} index={index} />
    </div>
  );
}

function SortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: string;
  sortField: string | null;
  sortDirection: "asc" | "desc";
}) {
  if (sortField !== field) {
    return (
      <span aria-hidden="true" className="ml-1 text-muted-foreground/50">
        ⇅
      </span>
    );
  }

  return sortDirection === "asc" ? (
    <ChevronUp className="ml-1 inline h-4 w-4" />
  ) : (
    <ChevronDown className="ml-1 inline h-4 w-4" />
  );
}

export function DataTable({
  data,
  height = 600,
  virtualized = false,
}: DataTableProps) {
  const dispatch = useAppDispatch();
  const sortField = useAppSelector((state) => state.table.sortField);
  const sortDirection = useAppSelector((state) => state.table.sortDirection);
  const editingRowIds = useAppSelector(
    (state) => state.table.editing.editingRowIds,
  );

  const handleSort = (field: string) => {
    dispatch(setSortField(field));
  };

  const editingRowIdSet = useMemo(() => new Set(editingRowIds), [editingRowIds]);
  const rowProps = useMemo<VirtualRowProps>(() => ({ rows: data }), [data]);
  const rowHeight = useMemo(
    () => (index: number, props: VirtualRowProps) => {
      const row = props.rows[index];
      return row && editingRowIdSet.has(row.id)
        ? EDITING_ROW_HEIGHT
        : COMPACT_ROW_HEIGHT;
    },
    [editingRowIdSet],
  );

  return (
    <div
      role="region"
      aria-label="Employee data table"
      className="overflow-x-auto rounded-lg border border-border bg-card"
    >
      <div role="table" aria-rowcount={data.length} className="min-w-[1480px]">
        <div
          role="row"
          className="sticky top-0 z-10 flex items-center border-b border-border bg-muted/50 px-4 py-4 backdrop-blur-sm"
        >
          {columns.map((column) => (
            <div
              key={column.field}
              role="columnheader"
              aria-sort={
                sortField === column.field
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
              className={column.className}
            >
              <button
                type="button"
                onClick={() => handleSort(column.field)}
                className="cursor-pointer text-left font-semibold text-foreground/80 transition-colors hover:text-primary"
                aria-label={`Sort by ${column.label}`}
              >
                {column.label}{" "}
                <SortIcon
                  field={column.field}
                  sortField={sortField}
                  sortDirection={sortDirection}
                />
              </button>
            </div>
          ))}
          <div className="flex-1" />
          <div
            role="columnheader"
            className="w-[112px] text-right font-semibold text-foreground/80"
          >
            Actions
          </div>
        </div>

        <div style={{ height: `${height}px`, overflowY: "auto" }}>
          {data.length > 0 ? (
            virtualized ? (
              <List
                aria-label="Virtualized employee rows"
                className="h-full"
                defaultHeight={height}
                rowComponent={VirtualTableRow}
                rowCount={data.length}
                rowHeight={rowHeight}
                rowProps={rowProps}
                overscanCount={12}
                style={{ height }}
              />
            ) : (
              data.map((row, index) => (
                <EditableTableRow key={row.id} row={row} index={index} />
              ))
            )
          ) : (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              No data found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
