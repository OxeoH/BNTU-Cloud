import { $host } from "../index";
import { CreateFileProps, File as MyFile } from "./types";

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

export const uploadFile = async (file: File, currentDir: string) => {
  const formdata: any = new FormData();
  formdata.append("file", file);
  currentDir ?? formdata.append("parentId", currentDir);
  const { data } = await $host.post<MyFile>("api/files/upload", formdata, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    onUploadProgress: (progressEvent) => {
      // if (progressEvent.total) {
      //   let progress = Math.round(
      //     (progressEvent.loaded * 100) / progressEvent.        );
      //   console.log(progress);
      // }\\
      console.log(progressEvent.estimated);
    },
  });
  return data;
};
