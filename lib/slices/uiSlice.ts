import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isFilterPanelOpen: boolean;
}

const initialState: UIState = {
  isFilterPanelOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleFilterPanel: (state) => {
      state.isFilterPanelOpen = !state.isFilterPanelOpen;
    },
  },
});

export const { toggleFilterPanel } = uiSlice.actions;

export default uiSlice.reducer;
