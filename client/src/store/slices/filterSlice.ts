import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { FileType } from "../../api/File/types";
import { User, UserRole } from "../../api/User/types";

export interface FileFilter {
  filetype: FileType | null;
  user: User | null;
  name: string | null;
}

export interface UserFilter {
  name: string | null;
  group: string | null;
  login: string | null;
  email: string | null;
  role: UserRole | null;
}

export interface FilterOption {
  value: string;
  title: string;
}

export interface IFileFilter {
  name: string;
  type: keyof FileFilter;
  options: FilterOption[];
}

export interface IUserFilter {
  name: string;
  type: keyof UserFilter;
  options: FilterOption[];
}

export interface FilterSlice {
  userFilterApplied: boolean;
  fileFilterApplied: boolean;
  fileFilter: FileFilter;
  userFilter: UserFilter;
  filtersList: IFileFilter[];
  userFiltersList: IUserFilter[];
}

const filtersList: IFileFilter[] = [
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

const userFiltersList: IUserFilter[] = [
  {
    name: "ФИО",
    type: "name",
    options: [],
  },
  {
    name: "Логин",
    type: "login",
    options: [],
  },
  {
    name: "Email",
    type: "email",
    options: [],
  },
  {
    name: "Группа",
    type: "group",
    options: [],
  },
  {
    name: "Роль",
    type: "role",
    options: Object.entries(UserRole).map((entry) => {
      return { value: entry[0], title: entry[1] };
    }),
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
  userFilterApplied: false,
  fileFilterApplied: false,
  userFilter: {
    name: null,
    group: null,
    login: null,
    email: null,
    role: null,
  },
  fileFilter: {
    filetype: null,
    user: null,
    name: null,
  },
  filtersList,
  userFiltersList,
};

export const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFileFilter: (state, action: PayloadAction<FileFilter>) => {
      state.fileFilterApplied = true;
      state.fileFilter = action.payload;
    },
    toggleFileFilterApplied: (state, action: PayloadAction<boolean>) => {
      state.fileFilterApplied = action.payload;
    },
    clearFileFilter: (state) => {
      state.fileFilter = initialState.fileFilter;
      state.fileFilterApplied = false;
    },
    setUserFilter: (state, action: PayloadAction<UserFilter>) => {
      state.userFilterApplied = true;
      state.userFilter = action.payload;
    },
    toggleUserFilterApplied: (state, action: PayloadAction<boolean>) => {
      state.userFilterApplied = action.payload;
    },
    clearUserFilter: (state) => {
      state.userFilter = initialState.userFilter;
      state.userFilterApplied = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setFileFilter,
  toggleFileFilterApplied,
  setUserFilter,
  toggleUserFilterApplied,
  clearUserFilter,
} = filterSlice.actions;

export default filterSlice.reducer;
