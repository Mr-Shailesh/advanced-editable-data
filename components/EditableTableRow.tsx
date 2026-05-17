"use client";

import { memo, useCallback } from "react";
import { TableRow } from "@/lib/slices/tableSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  startEditing,
  stopEditing,
  setEditValue,
  setValidationError,
  saveRow,
  deleteRow,
  undoRow,
} from "@/lib/slices/tableSlice";
import { validateRow } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { Trash2, Save, X, Edit2, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EditableTableRowProps {
  row: TableRow;
  index: number;
}

export const EditableTableRow = memo(function EditableTableRow({
  row,
  index,
}: EditableTableRowProps) {
  const dispatch = useAppDispatch();
  const isEditing = useAppSelector((state) =>
    state.table.editing.editingRowIds.includes(row.id),
  );
  const editValues = useAppSelector(
    (state) => state.table.editing.editValues[row.id] || {},
  );
  const errors = useAppSelector(
    (state) => state.table.editing.validationErrors[row.id] || {},
  );
  const hasUnsavedChanges = useAppSelector((state) =>
    state.table.editing.unsavedChanges.includes(row.id),
  );
  const canUndo = useAppSelector(
    (state) =>
      state.table.editing.rowUndoHistory[row.id] &&
      state.table.editing.rowUndoHistory[row.id].length > 0,
  );

  const displayValues = { ...row, ...editValues };

  const handleStartEditing = useCallback(() => {
    dispatch(startEditing(row.id));
  }, [dispatch, row.id]);

  const handleStopEditing = useCallback(() => {
    dispatch(stopEditing(row.id));
  }, [dispatch, row.id]);

  const handleFieldChange = useCallback(
    (field: keyof TableRow, value: any) => {
      dispatch(setEditValue({ rowId: row.id, field, value }));
    },
    [dispatch, row.id],
  );

  const handleSave = useCallback(() => {
    const rowWithEdits = { ...row, ...editValues };
    const validationErrors = validateRow(rowWithEdits);

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        dispatch(setValidationError({ rowId: row.id, field, error }));
      });
      return;
    }

    dispatch(saveRow({ rowId: row.id, values: editValues }));
  }, [dispatch, row, editValues]);

  const handleUndo = useCallback(() => {
    dispatch(undoRow(row.id));
  }, [dispatch, row.id]);

  if (isEditing) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 border-b border-border/50 px-4 py-3 text-sm bg-primary/10",
          index % 2 === 0 ? "bg-primary/5" : "bg-primary/10",
        )}
      >
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={displayValues.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="Name"
              className="w-[220px] px-2 py-1 bg-background border border-border rounded text-sm"
            />
            <input
              type="email"
              value={displayValues.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="Email"
              className="w-[300px] px-2 py-1 bg-background border border-border rounded text-sm"
            />
            <input
              type="text"
              value={displayValues.department}
              onChange={(e) => handleFieldChange("department", e.target.value)}
              placeholder="Department"
              className="w-[200px] px-2 py-1 bg-background border border-border rounded text-sm"
            />
            <select
              value={displayValues.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
              className="w-[200px] px-2 py-1 bg-background border border-border rounded text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
            <input
              type="number"
              value={displayValues.salary}
              onChange={(e) =>
                handleFieldChange("salary", parseFloat(e.target.value))
              }
              placeholder="Salary"
              className="w-[180px] px-2 py-1 bg-background border border-border rounded text-sm"
            />
            <input
              type="date"
              value={displayValues.hireDate}
              onChange={(e) => handleFieldChange("hireDate", e.target.value)}
              className="w-[130px] px-2 py-1 bg-background border border-border rounded text-sm"
            />
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {Object.entries(errors).map(([field, error]) => (
                <span
                  key={field}
                  className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded"
                >
                  {error}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="p-1.5 text-green-400 hover:bg-green-500/20 rounded transition-colors"
            title="Save"
          >
            <Save className="h-4 w-4 cursor-pointer" />
          </button>
          <button
            onClick={handleStopEditing}
            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors"
            title="Cancel"
          >
            <X className="h-4 w-4 cursor-pointer" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center border-b border-border/50 px-4 py-3 text-sm hover:bg-muted/40 transition-colors",
        index % 2 === 0 ? "bg-card" : "bg-muted/20",
        hasUnsavedChanges && "bg-yellow-500/10 border-yellow-500/30",
      )}
    >
      <div className="w-[220px] truncate font-medium text-foreground">
        {row.name}
      </div>
      <div className="w-[300px] truncate text-muted-foreground">
        {row.email}
      </div>
      <div className="w-[200px] truncate text-muted-foreground">
        {row.department}
      </div>
      <div className="w-[200px]">
        <span
          className={cn(
            "inline-block rounded-full px-2 py-1 text-xs font-medium",
            row.status === "active"
              ? "bg-green-500/20 text-green-400"
              : row.status === "on-leave"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-red-500/20 text-red-400",
          )}
        >
          {row.status}
        </span>
      </div>
      <div className="w-[180px] text-left">${row.salary.toLocaleString()}</div>
      <div className="w-[130px] text-left text-muted-foreground">
        {row.hireDate}
      </div>
      <div className="flex-1 flex items-center justify-end gap-2">
        {hasUnsavedChanges && (
          <span className="text-xs text-yellow-400">● Unsaved</span>
        )}
      </div>
      <div className="flex w-[112px] justify-end gap-1">
        <button
          onClick={handleStartEditing}
          className="p-1.5 text-primary hover:bg-primary/20 rounded transition-colors cursor-pointer"
          title="Edit"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={cn(
            "p-1.5 rounded transition-colors",
            canUndo
              ? "text-blue-400 hover:bg-blue-500/20 cursor-pointer"
              : "text-muted-foreground/30 cursor-not-allowed",
          )}
          title="Undo"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className="p-1.5 text-red-400 hover:bg-red-500/20 rounded transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Employee</AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Are you sure you want to delete {row.name}? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => dispatch(deleteRow(row.id))}
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
});
