import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { FileType } from "../../api/File/types";
import { User } from "../../api/User/types";

export interface Filter {
  type: FileType | null;
  user: User | null;
}

export interface FilterSlice {
  applied: boolean;
  filter: Filter;
}

const initialState: FilterSlice = {
  applied: false,
  filter: {
    type: null,
    user: null,
  },
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.applied = true;
      state.filter = action.payload;
    },
    toggleApplied: (state) => {
      state.applied = !state.applied;
    },
    clearFilter: (state) => {
      state = initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFilter, toggleApplied, clearFilter } = filterSlice.actions;

export default filterSlice.reducer;
