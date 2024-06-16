import { $host } from "../index";
import { Contact } from "./types";

export const addNewContact = async (contact: string) => {
  const { data } = await $host.post<Contact>(
    "api/contact/add",
    { contact },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  return data;
};

export const deleteContact = async (userContact: string) => {
  const { data } = await $host.post<Contact>(
    "api/contact/remove",
    { userContact },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );

  return data;
};

export const getUserContacts = async () => {
  try {
    const { data } = await $host.get<Contact[]>("api/contact/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return data ?? [];
  } catch (e: any) {
    console.log(e);
  }
};
