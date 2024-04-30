import { User } from "../User/types";

export type File = {
  id: string;
  name: string;
  type: FileType;
  access_link: string;
  size: bigint;
  path: string;
  root: boolean;
  user: User;
  parent: File;
  // childs: File[];
};

export enum FileType {
  DIR = "dir",
  MP3 = "mp3",
  TXT = "txt",
  ZIP = "zip",
  IMG = "img",
  MP4 = "mp4",
  RAR = "rar",
  JSON = "json",
  DOCX = "docx",
  SLN = "sln",
  CS = "cs",
  PNG = "png",
  JPEG = "jpeg",
  XLSX = "xlsx",
  PPTX = "pptx",
  EXE = "exe",
}

export interface CreateFileProps {
  name: string;
  type: FileType;
  parentId: string;
}
