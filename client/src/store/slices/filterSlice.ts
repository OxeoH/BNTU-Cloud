import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { FileType } from "../../api/File/types";
import { User } from "../../api/User/types";

export interface Filter {
  filetype: FileType | null;
  user: User | null;
  name: string | null;
}

export interface FilterOption {
  value: string;
  title: string;
}

export interface IFilter {
  name: string;
  type: "filetype" | "user" | "name";
  options: FilterOption[];
}

export interface FilterSlice {
  applied: boolean;
  filter: Filter;
  filtersList: IFilter[];
}

const filtersList: IFilter[] = [
  {
    name: "Название",
    type: "name",
    options: [],
  },
  {
    name: "Тип",
    type: "filetype",
    options: Object.entries(FileType).map((entry) => {
      return { value: entry[0], title: entry[1] };
    }),
  },
  {
    name: "Владелец",
    type: "user",
    options: [
      { value: "egor@gmail.com", title: "egor@gmail.com" },
      { value: "sasha@gmail.com", title: "sasha@gmail.com" },
    ],
  },

  // {
  //   name: "Местоположение",
  //   options: [
  //     { value: "all", title: "В любом месте" },
  //     { value: "my", title: "Моё хранилище" },
  //     { value: "shared", title: "Доступные мне" },
  //   ],
  // },
];

const initialState: FilterSlice = {
  applied: false,
  filter: {
    filetype: null,
    user: null,
    name: null,
  },
  filtersList,
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filter>) => {
      state.applied = true;
      state.filter = action.payload;
    },
    toggleApplied: (state, action: PayloadAction<boolean>) => {
      state.applied = action.payload;
    },
    clearFilter: (state) => {
      state = initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFilter, toggleApplied, clearFilter } = filterSlice.actions;

export default filterSlice.reducer;
