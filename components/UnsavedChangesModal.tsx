"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { saveAllRows } from "@/lib/slices/tableSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PendingAction {
  callback: () => void;
  label: string;
}

export function UnsavedChangesModal() {
  const dispatch = useAppDispatch();
  const unsavedCount = useAppSelector(
    (state) => state.table.editing.unsavedChanges.length,
  );
  const editingCount = useAppSelector(
    (state) => state.table.editing.editingRowIds.length,
  );
  const hasPendingEdits = editingCount > 0 || unsavedCount > 0;
  const [showModal, setShowModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<PendingAction | null>(
    null,
  );

  const handleSaveAndProceed = useCallback(() => {
    dispatch(saveAllRows());
    setShowModal(false);
    if (currentAction?.callback) {
      setTimeout(() => currentAction.callback(), 100);
    }
  }, [dispatch, currentAction]);

  const handleCancel = useCallback(() => {
    setShowModal(false);
    setCurrentAction(null);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasPendingEdits) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasPendingEdits]);

  useEffect(() => {
    (window as any).checkUnsavedChanges = (
      callback: () => void,
      label: string = "Action",
    ) => {
      if (hasPendingEdits) {
        setCurrentAction({ callback, label });
        setShowModal(true);
        return false;
      }
      return true;
    };

    return () => {
      delete (window as any).checkUnsavedChanges;
    };
  }, [hasPendingEdits]);

  return (
    <AlertDialog open={showModal} onOpenChange={setShowModal}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-2">
            You have{" "}
            <span className="font-semibold text-yellow-400">
              {editingCount}
            </span>{" "}
            row{editingCount !== 1 ? "s" : ""} in edit mode
            {unsavedCount > 0 && (
              <>
                {" "}
                with{" "}
                <span className="font-semibold text-yellow-400">
                  {unsavedCount}
                </span>{" "}
                unsaved change{unsavedCount !== 1 ? "s" : ""}
              </>
            )}
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            {currentAction?.label && `You're about to ${currentAction.label}. `}
            Would you like to save your changes before proceeding?
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <AlertDialogCancel
            onClick={handleCancel}
            className="bg-muted hover:bg-muted/80 cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSaveAndProceed}
            className="bg-green-600 hover:bg-green-700 cursor-pointer"
          >
            Save All & Proceed
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
