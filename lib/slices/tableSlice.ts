import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TableRow {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "active" | "inactive" | "on-leave";
  salary: number;
  hireDate: string;
}

export interface FilterState {
  status: string[];
  department: string[];
  salaryMin: number;
  salaryMax: number;
  dateFrom: string;
  dateTo: string;
}

export interface EditingState {
  editingRowIds: string[];
  editValues: Record<string, Partial<TableRow>>;
  validationErrors: Record<string, Record<string, string>>;
  unsavedChanges: string[];
  rowUndoHistory: Record<string, TableRow[]>;
}

interface TableState {
  data: TableRow[];
  filteredData: TableRow[];
  filters: FilterState;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  editing: EditingState;
}

const initialState: TableState = {
  data: [],
  filteredData: [],
  filters: {
    status: [],
    department: [],
    salaryMin: 0,
    salaryMax: 500000,
    dateFrom: "",
    dateTo: "",
  },
  sortField: null,
  sortDirection: "asc",
  currentPage: 1,
  pageSize: 50,
  searchQuery: "",
  editing: {
    editingRowIds: [],
    editValues: {},
    validationErrors: {},
    unsavedChanges: [],
    rowUndoHistory: {},
  },
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
      state.filteredData = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    setSortField: (state, action: PayloadAction<string>) => {
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortField = action.payload;
        state.sortDirection = "asc";
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    setFilteredData: (state, action: PayloadAction<TableRow[]>) => {
      state.filteredData = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = "";
      state.sortField = null;
      state.sortDirection = "asc";
      state.currentPage = 1;
      state.filteredData = state.data;
    },
    startEditing: (state, action: PayloadAction<string>) => {
      if (!state.editing.editingRowIds.includes(action.payload)) {
        state.editing.editingRowIds.push(action.payload);
      }
    },
    stopEditing: (state, action: PayloadAction<string>) => {
      state.editing.editingRowIds = state.editing.editingRowIds.filter(
        (id) => id !== action.payload,
      );
      delete state.editing.editValues[action.payload];
      delete state.editing.validationErrors[action.payload];
      state.editing.unsavedChanges = state.editing.unsavedChanges.filter(
        (id) => id !== action.payload,
      );
    },
    setEditValue: (
      state,
      action: PayloadAction<{
        rowId: string;
        field: keyof TableRow;
        value: any;
      }>,
    ) => {
      const { rowId, field, value } = action.payload;
      if (!state.editing.editValues[rowId]) {
        state.editing.editValues[rowId] = {};
      }
      state.editing.editValues[rowId][field] = value;
      if (!state.editing.unsavedChanges.includes(rowId)) {
        state.editing.unsavedChanges.push(rowId);
      }
    },
    setValidationError: (
      state,
      action: PayloadAction<{ rowId: string; field: string; error: string }>,
    ) => {
      const { rowId, field, error } = action.payload;
      if (!state.editing.validationErrors[rowId]) {
        state.editing.validationErrors[rowId] = {};
      }
      if (error) {
        state.editing.validationErrors[rowId][field] = error;
      } else {
        delete state.editing.validationErrors[rowId][field];
      }
    },
    saveRow: (
      state,
      action: PayloadAction<{ rowId: string; values: Partial<TableRow> }>,
    ) => {
      const { rowId, values } = action.payload;
      const rowIndex = state.data.findIndex((r) => r.id === rowId);
      if (rowIndex !== -1) {
        const originalRow = state.data[rowIndex];
        if (!state.editing.rowUndoHistory[rowId]) {
          state.editing.rowUndoHistory[rowId] = [];
        }
        state.editing.rowUndoHistory[rowId].push(originalRow);
        state.data[rowIndex] = { ...state.data[rowIndex], ...values };
        state.filteredData = state.filteredData.map((r) =>
          r.id === rowId ? { ...r, ...values } : r,
        );
        state.editing.unsavedChanges = state.editing.unsavedChanges.filter(
          (id) => id !== rowId,
        );
        state.editing.editingRowIds = state.editing.editingRowIds.filter(
          (id) => id !== rowId,
        );
        delete state.editing.editValues[rowId];
      }
    },
    undoRow: (state, action: PayloadAction<string>) => {
      const rowId = action.payload;
      if (
        state.editing.rowUndoHistory[rowId] &&
        state.editing.rowUndoHistory[rowId].length > 0
      ) {
        const previousRow = state.editing.rowUndoHistory[rowId].pop();
        if (previousRow) {
          const rowIndex = state.data.findIndex((r) => r.id === rowId);
          if (rowIndex !== -1) {
            state.data[rowIndex] = previousRow;
            state.filteredData = state.filteredData.map((r) =>
              r.id === rowId ? previousRow : r,
            );
            state.editing.unsavedChanges = state.editing.unsavedChanges.filter(
              (id) => id !== rowId,
            );
            state.editing.editingRowIds = state.editing.editingRowIds.filter(
              (id) => id !== rowId,
            );
            delete state.editing.editValues[rowId];
          }
        }
      }
    },
    saveAllRows: (state) => {
      const rowsToSave = state.editing.unsavedChanges.slice();
      rowsToSave.forEach((rowId) => {
        const rowIndex = state.data.findIndex((r) => r.id === rowId);
        const editValues = state.editing.editValues[rowId];
        if (rowIndex !== -1 && editValues) {
          const originalRow = state.data[rowIndex];
          if (!state.editing.rowUndoHistory[rowId]) {
            state.editing.rowUndoHistory[rowId] = [];
          }
          state.editing.rowUndoHistory[rowId].push(originalRow);
          state.data[rowIndex] = { ...state.data[rowIndex], ...editValues };
          state.filteredData = state.filteredData.map((r) =>
            r.id === rowId ? state.data[rowIndex] : r,
          );
          delete state.editing.editValues[rowId];
        }
      });
      state.editing.unsavedChanges = [];
      state.editing.editingRowIds = [];
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
      state.filteredData.push(action.payload);
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      const rowId = action.payload;
      state.data = state.data.filter((r) => r.id !== rowId);
      state.filteredData = state.filteredData.filter((r) => r.id !== rowId);
      state.editing.unsavedChanges = state.editing.unsavedChanges.filter(
        (id) => id !== rowId,
      );
      state.editing.editingRowIds = state.editing.editingRowIds.filter(
        (id) => id !== rowId,
      );
    },
  },
});

export const {
  setData,
  setSearchQuery,
  setFilters,
  setSortField,
  setCurrentPage,
  setPageSize,
  setFilteredData,
  resetFilters,
  startEditing,
  stopEditing,
  setEditValue,
  setValidationError,
  saveRow,
  undoRow,
  saveAllRows,
  addRow,
  deleteRow,
} = tableSlice.actions;

export default tableSlice.reducer;
