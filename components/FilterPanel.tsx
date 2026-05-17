"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setFilters, resetFilters } from "@/lib/slices/tableSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCheckUnsavedChanges } from "@/lib/useCheckUnsavedChanges";

const departments = [
  "Engineering",
  "Sales",
  "Marketing",
  "HR",
  "Finance",
  "Operations",
  "Product",
];
const statuses = ["active", "inactive", "on-leave"];

export function FilterPanel() {
  const dispatch = useAppDispatch();
  const checkUnsavedChanges = useCheckUnsavedChanges();
  const { isFilterPanelOpen } = useAppSelector((state) => state.ui);
  const { filters } = useAppSelector((state) => state.table);

  const handleStatusChange = useCallback(
    (status: string) => {
      checkUnsavedChanges(() => {
        const newStatuses = filters.status.includes(status as any)
          ? filters.status.filter((s) => s !== status)
          : [...filters.status, status as any];
        dispatch(setFilters({ status: newStatuses }));
      }, "apply filters");
    },
    [filters, dispatch, checkUnsavedChanges],
  );

  const handleDepartmentChange = useCallback(
    (department: string) => {
      checkUnsavedChanges(() => {
        const newDepartments = filters.department.includes(department)
          ? filters.department.filter((d) => d !== department)
          : [...filters.department, department];
        dispatch(setFilters({ department: newDepartments }));
      }, "apply filters");
    },
    [filters, dispatch, checkUnsavedChanges],
  );

  const handleSalaryMinChange = useCallback(
    (value: string) => {
      checkUnsavedChanges(() => {
        dispatch(setFilters({ salaryMin: parseInt(value) || 0 }));
      }, "apply filters");
    },
    [dispatch, checkUnsavedChanges],
  );

  const handleSalaryMaxChange = useCallback(
    (value: string) => {
      checkUnsavedChanges(() => {
        dispatch(setFilters({ salaryMax: parseInt(value) || 500000 }));
      }, "apply filters");
    },
    [dispatch, checkUnsavedChanges],
  );

  const handleDateFromChange = useCallback(
    (value: string) => {
      checkUnsavedChanges(() => {
        dispatch(setFilters({ dateFrom: value }));
      }, "apply filters");
    },
    [dispatch, checkUnsavedChanges],
  );

  const handleDateToChange = useCallback(
    (value: string) => {
      checkUnsavedChanges(() => {
        dispatch(setFilters({ dateTo: value }));
      }, "apply filters");
    },
    [dispatch, checkUnsavedChanges],
  );

  if (!isFilterPanelOpen) return null;

  return (
    <div
      id="employee-filter-panel"
      className="space-y-6 rounded-lg border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-colors hover:bg-card/70 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">◆</span>
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(resetFilters())}
          type="button"
          className="text-xs"
        >
          Reset All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Salary Range
          </Label>
          <div className="space-y-2">
            <Input
              aria-label="Minimum salary"
              type="number"
              placeholder="Min salary"
              value={filters.salaryMin}
              onChange={(e) => handleSalaryMinChange(e.target.value)}
              className="text-sm"
            />
            <Input
              aria-label="Maximum salary"
              type="number"
              placeholder="Max salary"
              value={filters.salaryMax}
              onChange={(e) => handleSalaryMaxChange(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Hire Date Range
          </Label>
          <div className="space-y-2">
            <Input
              aria-label="Hire date from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleDateFromChange(e.target.value)}
              className="text-sm"
            />
            <Input
              aria-label="Hire date to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleDateToChange(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Status</Label>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status as any)}
                  onCheckedChange={() => handleStatusChange(status)}
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium text-foreground capitalize cursor-pointer"
                >
                  {status.replace("-", " ")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Department
          </Label>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {departments.map((dept) => (
              <div key={dept} className="flex items-center space-x-2">
                <Checkbox
                  id={`dept-${dept}`}
                  checked={filters.department.includes(dept)}
                  onCheckedChange={() => handleDepartmentChange(dept)}
                />
                <label
                  htmlFor={`dept-${dept}`}
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  {dept}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
