export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

export interface ChangePasswordProps {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeProfileProps {
  name: string;
  surname: string;
  patronymic: string;
  login: string;
  email: string;
  group: string;
  role: UserRole;
}

export type RegisterProps = {
  login: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  patronymic: string;
  group?: string;
  role: UserRole;
};
export type AuthProps = {
  login: string;
  password: string;
};

export type userProps = {
  id: string;
  login: string;
};
