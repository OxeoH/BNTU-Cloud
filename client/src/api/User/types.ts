import { File } from "../File/types";

export type AuthResponse = {
  token: string;
  user: User;
};

export interface AuthProps {
  login: string;
  password: string;
}

export interface RegisterProps {
  name: string;
  surname: string;
  patronymic: string;
  login: string;
  email: string;
  password: string;
  group: string;
  role: UserRole;
}

export interface VerifyProps {
  token: string;
  user: User;
}

export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

export type User = {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  login: string;
  email: string;
  avatar: string;
  group: string;
  role: UserRole;
  confirmed: boolean;
  diskSpace: string;
  usedSpace: string;
  files: File[];
  // shared: File[];
  contacts: User[];
};

export type RegisterResponse = {
  message: string;
};
