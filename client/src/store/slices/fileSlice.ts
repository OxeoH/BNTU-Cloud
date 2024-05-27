import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { File, FileType } from "../../api/File/types";

export interface UploaderItem {
  id: number;
  name: string;
  type: FileType;
  progress: number;
}
export interface FilesState {
  sharedFiles: File[];
  files: File[];
  currentDir: File | null;
  rootDir: File | null;
  uploadingFiles: UploaderItem[];
}

const initialState: FilesState = {
  sharedFiles: [],
  files: [],
  currentDir: null,
  rootDir: null,
  uploadingFiles: [],
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
    removeFiles: (state, action: PayloadAction<string[]>) => {
      state.files = state.files.filter(
        (file) => !action.payload.includes(file.id)
      );
    },
    clearFiles: (state) => {
      state = initialState;
    },
    setSharedFiles: (state, action: PayloadAction<File[]>) => {
      state.sharedFiles = action.payload;
    },
    addSharedFiles: (state, action: PayloadAction<File[]>) => {
      state.sharedFiles = [...state.sharedFiles, ...action.payload];
    },
    removeSharedFiles: (state, action: PayloadAction<string[]>) => {
      state.sharedFiles = state.sharedFiles.filter(
        (file) => !action.payload.includes(file.id)
      );
    },
    //Uploader
    setUploadingFiles: (state, action: PayloadAction<UploaderItem[]>) => {
      state.uploadingFiles = action.payload;
    },
    addUploadingFiles: (state, action: PayloadAction<UploaderItem>) => {
      state.uploadingFiles.push(action.payload);
    },
    setUploadingProgress: (state, action: PayloadAction<UploaderItem>) => {
      state.uploadingFiles.map((file) =>
        file.id === action.payload.id
          ? (file.progress = action.payload.progress)
          : file
      );
    },
    clearUploadingFiles: (state) => {
      state.uploadingFiles = state.uploadingFiles.filter(
        (file) => file.progress !== 100
      );
    },
  },
});

export const {
  setFiles,
  setCurrentDir,
  setRootDir,
  addFiles,
  removeFiles,
  clearFiles,
  setUploadingFiles,
  setSharedFiles,
  addUploadingFiles,
  clearUploadingFiles,
  addSharedFiles,
  setUploadingProgress,
  removeSharedFiles,
} = fileSlice.actions;

export default fileSlice.reducer;
