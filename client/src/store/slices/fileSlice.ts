import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { File } from "../../api/File/types";

export interface FilesState {
  files: File[];
  currentDir: string;
}

const initialState: FilesState = {
  files: [],
  currentDir: "",
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
    },
    setCurrentDir: (state, action: PayloadAction<string>) => {
      state.currentDir = action.payload;
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

export const { setFiles, setCurrentDir } = fileSlice.actions;

export default fileSlice.reducer;
