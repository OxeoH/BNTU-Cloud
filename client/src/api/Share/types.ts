import { File } from "../File/types";
import { User } from "../User/types";

export type Share = {
  id: string;
  fromUser: User;
  toUser: User;
  file: File;
};
