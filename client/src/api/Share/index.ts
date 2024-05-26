import { File } from "../File/types";
import { User } from "../User/types";
import { $host } from "../index";
import { Share } from "./types";

export const addShare = async (fileId: string, toUser: string) => {
  const { data } = await $host.post<Share>(
    "api/shares/add",
    { fileId, toUser },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  return data;
};

export const removeShare = async (fileId: string, toUser: string) => {
  const { data } = await $host.post<Share>(
    "api/shares/remove",
    { fileId, toUser },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  return data;
};

export const getUserShares = async () => {
  try {
    const { data } = await $host.get<Share[]>("api/shares/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log(data);

    return data ?? [];
  } catch (e: any) {
    console.log(e);
  }
};
