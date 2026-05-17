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
      <div className="border-b border-border pb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
          Employee Database
        </h1>
        <p className="text-muted-foreground text-lg">
          Advanced data table with filtering, sorting, virtualization, and CSV
          export
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
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
        <div className="flex rounded-md border gap-2 border-border bg-card p-1">
          <Button
            type="button"
            variant={tableMode === "infinite" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTableModeChange("infinite")}
            className="gap-2 cursor-pointer"
          >
            <List className="h-4 w-4" />
            Infinite Scroll
          </Button>
          <Button
            type="button"
            variant={tableMode === "pagination" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTableModeChange("pagination")}
            className="gap-2 cursor-pointer"
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
