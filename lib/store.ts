import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "@/lib/slices/tableSlice";
import uiReducer from "@/lib/slices/uiSlice";

export const store = configureStore({
  reducer: {
    table: tableReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
