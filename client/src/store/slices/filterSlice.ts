import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { FileType } from "../../api/File/types";
import { User, UserRole } from "../../api/User/types";
import { groupsList } from "../../shared/groupsList";

export enum FilesPlacing {
  MY = "Моё хранилище",
  SHARED = "Доступные мне",
}

export enum UsersPlacing {
  MY = "Только мои",
  STRANGE = "Все, кроме моих",
}

export interface FileFilter {
  filetype: FileType | null;
  user: User | null;
  name: string | null;
  place: FilesPlacing;
}

export interface UserFilter {
  name: string | null;
  group: string | null;
  login: string | null;
  email: string | null;
  role: UserRole | null;
  place: UsersPlacing;
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
    options: [],
  },

  {
    name: "Местоположение",
    type: "place",
    options: Object.entries(FilesPlacing).map((entry) => {
      return { value: entry[0], title: entry[1] };
    }),
  },
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
    options: groupsList.map((entry) => {
      return { value: `${entry}`, title: `${entry}` };
    }),
  },
  {
    name: "Роль",
    type: "role",
    options: Object.entries(UserRole).map((entry) => {
      return {
        value: entry[0],
        title: entry[1][0].toLocaleUpperCase() + entry[1].slice(1),
      };
    }),
  },
  {
    name: "Местоположение",
    type: "place",
    options: Object.entries(UsersPlacing).map((entry) => {
      return { value: entry[0], title: entry[1] };
    }),
  },
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
    place: UsersPlacing.MY,
  },
  fileFilter: {
    place: FilesPlacing.MY,
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
    updateUserOptions: (state, action: PayloadAction<User[]>) => {
      state.filtersList = state.filtersList.map((filterNote) => {
        if (filterNote.type === "user") {
          return {
            ...filterNote,
            options: action.payload.map((entry) => {
              return {
                value: entry.email,
                title: entry.email,
              };
            }),
          };
        }
        return filterNote;
      });

      state.userFiltersList = state.userFiltersList.map((filterNote) => {
        if (filterNote.type === "email") {
          return {
            ...filterNote,
            options: action.payload.map((entry) => {
              return {
                value: entry.email,
                title: entry.email,
              };
            }),
          };
        }
        return filterNote;
      });
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
  updateUserOptions,
} = filterSlice.actions;

export default filterSlice.reducer;
