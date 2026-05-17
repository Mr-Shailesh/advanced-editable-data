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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex-1 w-full sm:w-auto flex items-center gap-2 bg-card border border-border/50 rounded-lg px-4 py-2.5 focus-within:border-primary/50 transition-colors">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        {unsavedCount > 0 && (
          <Button
            variant="default"
            size="sm"
            onClick={() => dispatch(saveAllRows())}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Save All ({unsavedCount})
          </Button>
        )}

        <Button
          variant={isFilterPanelOpen ? "default" : "outline"}
          size="sm"
          onClick={handleFilterClick}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportClick}
          disabled={filteredData.length === 0}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
