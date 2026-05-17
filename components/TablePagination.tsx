"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCurrentPage, setPageSize } from "@/lib/slices/tableSlice";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCheckUnsavedChanges } from "@/lib/useCheckUnsavedChanges";

interface TablePaginationProps {
  totalPages: number;
  totalRows: number;
}

export function TablePagination({
  totalPages,
  totalRows,
}: TablePaginationProps) {
  const dispatch = useAppDispatch();
  const checkUnsavedChanges = useCheckUnsavedChanges();
  const { currentPage, pageSize } = useAppSelector((state) => state.table);

  const pageSizeOptions = [10, 25, 50, 100];

  const handlePageSizeChange = useCallback(
    (value: string) => {
      checkUnsavedChanges(() => {
        dispatch(setPageSize(parseInt(value)));
      }, "change page size");
    },
    [dispatch, checkUnsavedChanges],
  );

  const handlePreviousPage = useCallback(() => {
    checkUnsavedChanges(() => {
      dispatch(setCurrentPage(currentPage - 1));
    }, "change page");
  }, [currentPage, dispatch, checkUnsavedChanges]);

  const handleNextPage = useCallback(() => {
    checkUnsavedChanges(() => {
      dispatch(setCurrentPage(currentPage + 1));
    }, "change page");
  }, [currentPage, dispatch, checkUnsavedChanges]);

  return (
    <div className="mt-6 flex flex-col items-stretch gap-4 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {Math.min((currentPage - 1) * pageSize + 1, totalRows)} to{" "}
        {Math.min(currentPage * pageSize, totalRows)} of {totalRows} results
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <select
          aria-label="Rows per page"
          value={pageSize}
          onChange={(e) => handlePageSizeChange(e.target.value)}
          className="px-2 py-1 rounded border border-border bg-background text-sm text-foreground"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-2 sm:justify-start">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-sm font-medium text-foreground">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
