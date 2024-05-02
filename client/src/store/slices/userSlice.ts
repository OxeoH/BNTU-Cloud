import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "../../api/User/types";

export interface UserState {
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
  files: [],
};

const initialState: UserState = {
  currentUser: emptyUser,
  isAuth: false,
};

export const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuth = true;
    },
    logout: (state) => {
      state.currentUser = emptyUser;
      state.isAuth = false;
    },
  },
});
export const { setUser, logout } = counterSlice.actions;

export default counterSlice.reducer;
