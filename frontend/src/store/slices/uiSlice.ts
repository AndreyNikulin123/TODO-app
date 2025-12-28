import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TasksFilters = {
  search?: string;
  completed?: boolean;
  priority?: string;
};

type TasksUiState = {
  selectFolderId?: string | null;
  filters: TasksFilters;
};

const initialState: TasksUiState = {
  selectFolderId: null,
  filters: {
    search: undefined,
    completed: undefined,
    priority: undefined,
  },
};

export const taskUiSlice = createSlice({
  name: 'tasksUi',
  initialState,
  reducers: {
    setSelectFolderId: (
      state: TasksUiState,
      action: PayloadAction<string | null>,
    ) => {
      console.log(state, action);
      state.selectFolderId = action.payload;
    },
    setFilters: (state: TasksUiState, action: PayloadAction<TasksFilters>) => {
      state.filters = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setSelectFolderId, setFilters, resetFilters } =
  taskUiSlice.actions;

export default taskUiSlice.reducer;
