import { User } from "../User/user.entity";
import { File } from "./file.entity";

export type CreateProps = {
  name: string;
  type: FileType;
  parent: File;
  path: string;
  user: User;
};

export type FileProps = {
  name: string;
  type: FileType;
  parentId: string;
};

export enum FileType {
  DIR = "dir",
  TXT = "txt",
}
