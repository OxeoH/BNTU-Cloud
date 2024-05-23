import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "../../api/User/types";

export interface UserState {
  users: User[];
  currentUser: User;
  isAuth: boolean;
}
const emptyUser: User = {
  id: "",
  name: "",
  surname: "",
  patronymic: "",
  login: "",
  email: "",
  avatar: "",
  group: "",
  role: UserRole.STUDENT,
  confirmed: false,
  diskSpace: "0",
  usedSpace: "0",
  contacts: [],
  files: [],
};

const initialState: UserState = {
  users: [],
  currentUser: emptyUser,
  isAuth: false,
};

export const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuth = true;
    },
    logout: (state) => {
      state.currentUser = emptyUser;
      state.isAuth = false;
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.currentUser.avatar = action.payload;
    },
  },
});
export const { setUser, setUsers, logout, setAvatar } = counterSlice.actions;

export default counterSlice.reducer;
