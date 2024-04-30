import {
  FolderZip,
  Image,
  TextSnippet,
  Folder,
  InsertDriveFile,
  MusicNote,
  VideoFile,
  Album,
  Microsoft,
} from "@mui/icons-material";
import { FileType } from "../api/File/types";

export const getFileIcon = (type: FileType) => {
  switch (type) {
    case FileType.DIR:
      return <Folder />;
    case FileType.MP3:
      return <MusicNote />;
    case FileType.TXT:
      return <TextSnippet />;
    case FileType.ZIP:
      return <FolderZip />;
    case FileType.RAR:
      return <FolderZip />;
    case FileType.PNG:
      return <Image />;
    case FileType.JPEG:
      return <Image />;
    case FileType.MP4:
      return <VideoFile />;
    case FileType.IMG:
      return <Album />;
    case FileType.JSON:
      return <InsertDriveFile />;
    case FileType.DOCX:
      return <Microsoft />;
    case FileType.SLN:
      return <InsertDriveFile />;
    case FileType.XLSX:
      return <Microsoft />;
    case FileType.PPTX:
      return <Microsoft />;
    case FileType.EXE:
      return <InsertDriveFile />;
    default:
      return <InsertDriveFile />;
  }
};
