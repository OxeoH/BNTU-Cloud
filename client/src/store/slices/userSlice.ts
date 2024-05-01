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
  diskSpace: BigInt(0),
  usedSpace: BigInt(0),
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
      //localStorage.setItem("token", "");
      state.currentUser = emptyUser;
      state.isAuth = false;
    },
    // increment: (state) => {
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, logout } = counterSlice.actions;

export default counterSlice.reducer;
