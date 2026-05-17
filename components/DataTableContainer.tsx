"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setData, setFilteredData } from "@/lib/slices/tableSlice";
import { DataTable } from "@/components/DataTable";
import { FilterPanel } from "@/components/FilterPanel";
import { TableToolbar } from "@/components/TableToolbar";
import { TablePagination } from "@/components/TablePagination";
import { AddEmployeeForm } from "@/components/AddEmployeeForm";
import { Button } from "@/components/ui/button";
import { generateMockData } from "@/lib/mockData";
import {
  applyFiltersAndSearch,
  applySorting,
  getPaginatedData,
  exportToCSV,
} from "@/lib/tableUtils";
import { useCheckUnsavedChanges } from "@/lib/useCheckUnsavedChanges";
import { List, Table2 } from "lucide-react";

type TableMode = "infinite" | "pagination";

export function DataTableContainer() {
  const dispatch = useAppDispatch();
  const checkUnsavedChanges = useCheckUnsavedChanges();
  const [tableMode, setTableMode] = useState<TableMode>("infinite");
  const {
    data,
    filteredData,
    filters,
    searchQuery,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
  } = useAppSelector((state) => state.table);

  useEffect(() => {
    if (data.length === 0) {
      const mockData = generateMockData(10000);
      dispatch(setData(mockData));
    }
  }, [dispatch, data.length]);

  useEffect(() => {
    const filtered = applyFiltersAndSearch(data, filters, searchQuery);
    const sorted = applySorting(filtered, sortField, sortDirection);
    dispatch(setFilteredData(sorted));
  }, [data, filters, searchQuery, sortField, sortDirection, dispatch]);

  const {
    data: paginatedData,
    totalPages,
    totalRows,
  } = getPaginatedData(filteredData, currentPage, pageSize);

  const handleExport = () => {
    exportToCSV(
      filteredData,
      `employee-data-${new Date().toISOString().split("T")[0]}.csv`,
    );
  };

  const handleTableModeChange = useCallback(
    (mode: TableMode) => {
      if (mode === tableMode) return;

      checkUnsavedChanges(
        () => {
          setTableMode(mode);
        },
        `switch to ${mode === "infinite" ? "infinite scroll" : "pagination"}`,
      );
    },
    [checkUnsavedChanges, tableMode],
  );

  const tableRows = tableMode === "infinite" ? filteredData : paginatedData;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-5 sm:pb-6">
        <h1 className="mb-2 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
          Employee Database
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Advanced data table with filtering, sorting, virtualization, and CSV
          export
        </p>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <TableToolbar onExport={handleExport} />
        <AddEmployeeForm />
      </div>
      <FilterPanel />

      <div className="flex flex-col gap-3 border-y border-border py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Table Mode</h2>
          <p className="text-sm text-muted-foreground">
            Showing {filteredData.length.toLocaleString()} matching employees
          </p>
        </div>
        <div
          className="grid grid-cols-1 gap-2 rounded-md border border-border bg-card p-1 sm:flex"
          role="group"
          aria-label="Table display mode"
        >
          <Button
            type="button"
            variant={tableMode === "infinite" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTableModeChange("infinite")}
            aria-pressed={tableMode === "infinite"}
            className="gap-2 cursor-pointer justify-center"
          >
            <List className="h-4 w-4" />
            Infinite Scroll
          </Button>
          <Button
            type="button"
            variant={tableMode === "pagination" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTableModeChange("pagination")}
            aria-pressed={tableMode === "pagination"}
            className="gap-2 cursor-pointer justify-center"
          >
            <Table2 className="h-4 w-4" />
            Pagination
          </Button>
        </div>
      </div>

      <div className="shadow-lg rounded-lg overflow-hidden">
        <DataTable
          data={tableRows}
          height={600}
          virtualized={tableMode === "infinite"}
        />
      </div>

      {tableMode === "pagination" && (
        <TablePagination totalPages={totalPages} totalRows={totalRows} />
      )}
    </div>
  );
}
