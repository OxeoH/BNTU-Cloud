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
    console.log(data);

    return data ?? [];
  } catch (e: any) {
    console.log(e);
  }
};

// export const authorization = async (props: AuthProps) => {
//   const { data } = await $host.post<AuthResponse>("api/user/login", props);

//   localStorage.setItem("token", `${data.token}`);

//   // const result: AuthResponse = {
//   //   user: jwt_decode<User>(data.token),
//   //   groups: data.groups,
//   // };

//   return data;
// };

// export const verifyAuth = async () => {
//   try {
//     const { data } = await $host.get<VerifyProps>("api/user/verify-auth", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     });

//     localStorage.setItem("token", `${data.token}`);

//     return data.user;
//   } catch (e: any) {
//     localStorage.setItem("token", "");
//   }
// };
// // };

// export const checkIsAdmin = async () => {
//   const { data } = await $authHost.post<boolean>("api/user/admin/check", {
//     token: localStorage.getItem("token") ?? "",
//   });

//   return data;
// };
