"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSearchQuery, saveAllRows } from "@/lib/slices/tableSlice";
import { toggleFilterPanel } from "@/lib/slices/uiSlice";
import { Button } from "@/components/ui/button";
import { Filter, Search, Download, Save } from "lucide-react";
import { useCheckUnsavedChanges } from "@/lib/useCheckUnsavedChanges";

interface TableToolbarProps {
  onExport: () => void;
}

export function TableToolbar({ onExport }: TableToolbarProps) {
  const dispatch = useAppDispatch();
  const { searchQuery, filteredData } = useAppSelector((state) => state.table);
  const { isFilterPanelOpen } = useAppSelector((state) => state.ui);
  const unsavedCount = useAppSelector(
    (state) => state.table.editing.unsavedChanges.length,
  );
  const checkUnsavedChanges = useCheckUnsavedChanges();

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value));
  };

  const handleFilterClick = useCallback(() => {
    checkUnsavedChanges(() => {
      dispatch(toggleFilterPanel());
    }, "apply filters");
  }, [dispatch, checkUnsavedChanges]);

  const handleExportClick = useCallback(() => {
    checkUnsavedChanges(() => {
      onExport();
    }, "export CSV");
  }, [checkUnsavedChanges, onExport]);

  return (
    <div className="mb-0 flex w-full flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full min-w-0 flex-1 items-center gap-2 rounded-lg border border-border/50 bg-card px-4 py-2.5 transition-colors focus-within:border-primary/50 lg:max-w-xl">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          aria-label="Search employees by name or email"
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {unsavedCount > 0 && (
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => dispatch(saveAllRows())}
            className="flex flex-1 cursor-pointer items-center gap-2 bg-green-600 hover:bg-green-700 sm:flex-none"
          >
            <Save className="h-4 w-4" />
            Save All ({unsavedCount})
          </Button>
        )}

        <Button
          type="button"
          variant={isFilterPanelOpen ? "default" : "outline"}
          size="sm"
          onClick={handleFilterClick}
          aria-expanded={isFilterPanelOpen}
          aria-controls="employee-filter-panel"
          className="flex flex-1 cursor-pointer items-center gap-2 sm:flex-none"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportClick}
          disabled={filteredData.length === 0}
          className="flex flex-1 cursor-pointer items-center gap-2 sm:flex-none"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
