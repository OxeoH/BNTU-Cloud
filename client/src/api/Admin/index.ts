import { $authHost, $host } from "../index";
import {
  User,
  ChangeContactPasswordProps,
  ChangeContactProfileProps,
} from "../User/types";

// export const registration = async (props: RegisterProps) => {
//   const { data } = await $host.post<RegisterResponse>(
//     "api/user/registration",
//     props
//   );

//   return data.message;
// };

// export const getAllUsers = async () => {
//   try {
//     const { data } = await $host.get<User[]>("api/user/all", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     });

//     return data ?? [];
//   } catch (e: any) {
//     console.log(e);
//   }
// };

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

// export const checkIsAdmin = async () => {
//   const { data } = await $authHost.post<boolean>("api/user/admin/check", {
//     token: localStorage.getItem("token") ?? "",
//   });

//   return data;
// };
export const changeContactPassword = async (
  props: ChangeContactPasswordProps
) => {
  try {
    const { data } = await $host.post<{ token: string }>(
      "api/user/admin/change/password",
      props,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    localStorage.setItem("token", `${data.token}`);

    return data.token;
  } catch (e: any) {
    console.log(e);
  }
};

export const changeContactProfileInfo = async (
  props: ChangeContactProfileProps
) => {
  try {
    const { data } = await $host.post<User>(
      "api/user/admin/change/info",
      props,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    return data;
  } catch (e: any) {
    console.log(e);
  }
};

export const uploadContactAvatar = async (file: File, id: string) => {
  try {
    const formdata: any = new FormData();

    formdata.append("file", file);
    formdata.append("id", id);

    const { data } = await $host.post<{ avatar: string }>(
      "api/files/admin/change/avatar",
      formdata,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return data;
  } catch (e) {
    console.log(e);
    return { avatar: "" };
  }
};
