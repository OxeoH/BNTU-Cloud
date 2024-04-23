import { $authHost, $host } from "../index";
import {
  AuthProps,
  AuthResponse,
  RegisterProps,
  RegisterResponse,
  VerifyProps,
} from "./types";

export const registration = async (props: RegisterProps) => {
  const { data } = await $host.post<RegisterResponse>(
    "api/user/registration",
    props
  );

  return data.message;
};

export const authorization = async (props: AuthProps) => {
  const { data } = await $host.post<AuthResponse>("api/user/login", props);

  localStorage.setItem("token", `${data.token}`);

  // const result: AuthResponse = {
  //   user: jwt_decode<User>(data.token),
  //   groups: data.groups,
  // };

  return data;
};

export const verifyAuth = async () => {
  try {
    const { data } = await $host.get<VerifyProps>("api/user/verify-auth", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    localStorage.setItem("token", `${data}`);

    return data.user;
  } catch (e: any) {
    localStorage.setItem("token", "");
  }
};

// export const check = async () => {
//   const { data } = await $host.post<AuthResponse>("api/user/check", {
//     token: localStorage.getItem("token") ?? "",
//   });

//   localStorage.setItem("token", `${data.token}`);

// const result: AuthResult = {
//   user: jwt_decode<User>(data.token),
//   groups: data.groups,
// };

//   return result;
// };

export const checkIsAdmin = async () => {
  const { data } = await $authHost.post<boolean>("api/user/admin/check", {
    token: localStorage.getItem("token") ?? "",
  });

  return data;
};
