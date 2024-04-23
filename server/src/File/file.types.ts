import { User } from "../User/user.entity";
import { File } from "./file.entity";

export type CreateProps = {
  name: string;
  type: FileType;
  parent: File;
  path: string;
  user: User;
};

export interface FileProps {
  name: string;
  type: FileType;
  parentId: string;
}

export enum FileType {
  DIR = "dir",
  MP3 = "mp3",
  TXT = "txt",
  ZIP = "zip",
  IMG = "img",
  MP4 = "mp4",
}

export interface FetchProps {
  user: User;
  parent: File;
}
