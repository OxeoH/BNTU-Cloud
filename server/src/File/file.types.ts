import { User } from "../User/user.entity";
import { File } from "./file.entity";

export type CreateProps = {
  name: string;
  type: FileType;
  parent: File;
  path: string;
  user: User;
  root: boolean;
  size: bigint;
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
  MP4 = "mp4",
  RAR = "rar",
  JSON = "json",
  DOCX = "docx",
  SLN = "sln",
  CS = "cs",
  PNG = "png",
  JPG = "jpg",
  XLSX = "xlsx",
  PPTX = "pptx",
  EXE = "exe",
}

export interface FetchProps {
  user: User;
  parent: File;
}
