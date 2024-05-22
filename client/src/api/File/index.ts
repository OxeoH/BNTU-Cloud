import {
  ActionCreatorWithPayload,
  ThunkDispatch,
  UnknownAction,
} from "@reduxjs/toolkit";
import { FilesState, UploaderItem } from "../../store/slices/fileSlice";
import { $host } from "../index";
import { CreateFileProps, FileType, File as MyFile } from "./types";
import { UserState } from "../../store/slices/userSlice";
import { FilterSlice } from "../../store/slices/filterSlice";

export const getFiles = async (parentId: string) => {
  const { data } = await $host.get<MyFile[]>(`api/files`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: { parentId },
  });

  return data;
};

export const createFile = async (props: CreateFileProps) => {
  const { data } = await $host.post<MyFile>("api/files/create", props, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return data;
};

export const uploadFile = async (
  file: File,
  currentDir: MyFile,
  dispatch: ThunkDispatch<
    {
      filter: FilterSlice;
      user: UserState;
      file: FilesState;
    },
    undefined,
    UnknownAction
  >,
  addUploadingFiles: ActionCreatorWithPayload<
    UploaderItem,
    "file/addUploadingFiles"
  >,
  setUploadingProgress: ActionCreatorWithPayload<
    UploaderItem,
    "file/setUploadingProgress"
  >
) => {
  const formdata: any = new FormData();
  let uploading: UploaderItem = {
    id: Date.now(),
    name: file.name,
    type: file.name.split(".").pop() as FileType,
    progress: 0,
  };
  dispatch(addUploadingFiles(uploading));
  formdata.append("file", file);
  formdata.append("parentId", currentDir.id);

  const { data } = await $host.post<MyFile>("api/files/upload", formdata, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    onUploadProgress: (progressEvent) => {
      uploading.progress = (progressEvent.progress ?? 1) * 100;
      dispatch(setUploadingProgress(uploading));
    },
  });
  return data;
};

export const uploadAvatar = async (file: File) => {
  const formdata: any = new FormData();

  formdata.append("file", file);

  const { data } = await $host.post<{ avatar: string }>(
    "api/files/avatar",
    formdata,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return data;
};

export const deleteAvatar = async () => {
  const { data } = await $host.delete<{ message: string }>("api/files/avatar", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return { data };
};

export const deleteFile = async (id: string) => {
  const { data } = await $host.post<MyFile>(
    "api/files/delete",
    { id },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return data;
};

export const downloadFile = async (file: MyFile) => {
  // const { status, data } = await $host.get(`api/files/download`, {
  //   headers: {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     "Content-Type": "multipart/form-data",
  //   },
  //   params: { id: file.id },
  //   responseType: "blob",
  // });

  const response = await fetch(
    `http://localhost:5000/api/files/download?id=${file.id}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (response.status === 200) {
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};
