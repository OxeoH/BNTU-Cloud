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

export const uploadFile = async (
  file: File,
  currentDir: MyFile,
  setProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const formdata: any = new FormData();

  formdata.append("file", file);
  formdata.append("parentId", currentDir.id);
  const { data } = await $host.post<MyFile>("api/files/upload", formdata, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    onUploadProgress: (progressEvent) => {
      setProgress((progressEvent.progress ?? 1) * 100);
    },
  });
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
