import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "../../api/User/types";
import { Contact } from "../../api/Contact/types";
import { Share } from "../../api/Share/types";

export interface UserState {
  userShares: Share[];
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
  shared: [],
};

const initialState: UserState = {
  userShares: [],
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
    addContact: (state, action: PayloadAction<Contact>) => {
      state.currentUser.contacts = [
        ...state.currentUser.contacts,
        action.payload,
      ];
    },
    removeContact: (state, action: PayloadAction<Contact>) => {
      state.currentUser.contacts = state.currentUser.contacts.filter(
        (contact) => contact.id !== action.payload.id
      );
    },
    setShares: (state, action: PayloadAction<Share[]>) => {
      state.userShares = action.payload;
    },
    addNewShare: (state, action: PayloadAction<Share>) => {
      state.userShares = [...state.userShares, action.payload];
    },
    deleteShare: (state, action: PayloadAction<Share>) => {
      state.userShares = state.userShares.filter(
        (share) => share.id !== action.payload.id
      );
    },
  },
});
export const {
  setUser,
  setUsers,
  logout,
  setAvatar,
  addContact,
  removeContact,
  addNewShare,
  deleteShare,
  setShares,
} = counterSlice.actions;

export default counterSlice.reducer;
