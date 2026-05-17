"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { UnsavedChangesModal } from "@/components/UnsavedChangesModal";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <UnsavedChangesModal />
      {children}
    </Provider>
  );
}
