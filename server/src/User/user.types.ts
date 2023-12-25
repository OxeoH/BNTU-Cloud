export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
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
