import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { File } from "../../api/File/types";

export interface FilesState {
  files: File[];
  currentDir: File | null;
  rootDir: File | null;
}

const initialState: FilesState = {
  files: [],
  currentDir: null,
  rootDir: null,
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
    },
    setCurrentDir: (state, action: PayloadAction<File>) => {
      state.currentDir = action.payload;
    },
    setRootDir: (state, action: PayloadAction<File>) => {
      state.rootDir = action.payload;
    },
    addFiles: (state, action: PayloadAction<File[]>) => {
      state.files = [...state.files, ...action.payload];
    },
    removeFiles: (state, action: PayloadAction<File[]>) => {
      state.files = state.files.filter(
        (file) => !action.payload.includes(file)
      );
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

export const { setFiles, setCurrentDir, setRootDir, addFiles, removeFiles } =
  fileSlice.actions;

export default fileSlice.reducer;
