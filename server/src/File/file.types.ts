import { User } from "../User/user.entity";
import { File } from "./file.entity";

export type CreateProps = {
  name: string;
  type: string;
  parent: File;
  path: string;
  user: User;
};
