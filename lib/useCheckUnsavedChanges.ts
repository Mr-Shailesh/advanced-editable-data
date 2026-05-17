"use client";

import { useCallback } from "react";

export function useCheckUnsavedChanges() {
  return useCallback((callback: () => void, label: string = "Action") => {
    if (typeof window !== "undefined" && (window as any).checkUnsavedChanges) {
      const shouldProceed = (window as any).checkUnsavedChanges(
        callback,
        label,
      );
      if (!shouldProceed) {
        return false;
      }
    }
    callback();
    return true;
  }, []);
}
