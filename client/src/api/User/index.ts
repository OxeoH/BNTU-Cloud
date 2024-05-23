import { $authHost, $host } from "../index";
import {
  AuthProps,
  AuthResponse,
  RegisterProps,
  RegisterResponse,
  User,
  VerifyProps,
} from "./types";

export const registration = async (props: RegisterProps) => {
  const { data } = await $host.post<RegisterResponse>(
    "api/user/registration",
    props
  );

  return data.message;
};

export const getAllUsers = async () => {
  try {
    const { data } = await $host.get<User[]>("api/user/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return data ?? [];
  } catch (e: any) {
    console.log(e);
  }
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

    localStorage.setItem("token", `${data.token}`);

    return data.user;
  } catch (e: any) {
    localStorage.setItem("token", "");
  }
};
// };

export const checkIsAdmin = async () => {
  const { data } = await $authHost.post<boolean>("api/user/admin/check", {
    token: localStorage.getItem("token") ?? "",
  });

  return data;
};
