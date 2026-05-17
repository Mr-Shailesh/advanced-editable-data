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
    <div style={style}>
      <EditableTableRow row={row} index={index} />
    </div>
  );
}

function SortIcon({ field }: { field: string }) {
  const { sortField, sortDirection } = useAppSelector((state) => state.table);

  if (sortField !== field) {
    return <span className="ml-1 text-muted-foreground/50">⇅</span>;
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
  const editingRowIds = useAppSelector(
    (state) => state.table.editing.editingRowIds,
  );

  const handleSort = (field: string) => {
    dispatch(setSortField(field));
  };

  const rowProps = useMemo<VirtualRowProps>(() => ({ rows: data }), [data]);
  const rowHeight = useMemo(
    () => (index: number, props: VirtualRowProps) => {
      const row = props.rows[index];
      return row && editingRowIds.includes(row.id)
        ? EDITING_ROW_HEIGHT
        : COMPACT_ROW_HEIGHT;
    },
    [editingRowIds],
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex items-center border-b border-border bg-muted/50 px-4 py-4 sticky top-0 z-10 backdrop-blur-sm">
        <button
          onClick={() => handleSort("name")}
          className="w-[220px] text-left font-semibold text-foreground/80 hover:text-primary transition-colors cursor-pointer"
        >
          Name <SortIcon field="name" />
        </button>
        <button
          onClick={() => handleSort("email")}
          className="w-[300px] text-left font-semibold text-foreground/80 hover:text-primary transition-colors cursor-pointer"
        >
          Email <SortIcon field="email" />
        </button>
        <button
          onClick={() => handleSort("department")}
          className="w-[200px] text-left font-semibold text-foreground/80 hover:text-primary transition-colors cursor-pointer"
        >
          Department <SortIcon field="department" />
        </button>
        <button
          onClick={() => handleSort("status")}
          className="w-[200px] text-left font-semibold text-foreground/80 hover:text-primary transition-colors cursor-pointer"
        >
          Status <SortIcon field="status" />
        </button>
        <button
          onClick={() => handleSort("salary")}
          className="w-[180px] text-left font-semibold text-foreground/80 hover:text-primary transition-colors cursor-pointer"
        >
          Salary <SortIcon field="salary" />
        </button>
        <button
          onClick={() => handleSort("hireDate")}
          className="w-[130px] text-left font-semibold text-foreground/80 hover:text-primary transition-colors cursor-pointer"
        >
          Hire Date <SortIcon field="hireDate" />
        </button>
        <div className="flex-1" />
        <div className="w-[112px] text-right font-semibold text-foreground/80">
          Actions
        </div>
      </div>

      <div style={{ height: `${height}px`, overflowY: "auto" }}>
        {data.length > 0 ? (
          virtualized ? (
            <List
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
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No data found
          </div>
        )}
      </div>
    </div>
  );
}
