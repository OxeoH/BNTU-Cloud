import { User } from "../User/types";

export type Contact = {
  id: string;

  user: User;

  contactUser: User;
};
