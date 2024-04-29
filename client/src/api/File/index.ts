import { $host } from "../index";
import { CreateFileProps, File } from "./types";

export const getFiles = async (parentId: string) => {
  const { data } = await $host.get<File[]>(`api/files`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: { parentId },
  });

  return data;
};

export const createFile = async (props: CreateFileProps) => {
  const { data } = await $host.post<File>("api/files/create", props, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return data;
};

export const uploadFile = async (file: File) => {
  const { data } = await $host.post<File>("api/files/upload", file);
  console.log("Upload file: ", data);

  //return data;
};
