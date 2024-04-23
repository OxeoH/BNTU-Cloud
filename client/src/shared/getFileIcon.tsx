import {
  FolderZip,
  Image,
  TextSnippet,
  Folder,
  InsertDriveFile,
  MusicNote,
  VideoFile,
} from "@mui/icons-material";

export const getFileIcon = (type: string) => {
  switch (type) {
    case "dir":
      return <Folder />;
    case "mp3":
      return <MusicNote />;
    case "txt":
      return <TextSnippet />;
    case "zip":
      return <FolderZip />;
    case "img":
      return <Image />;
    case "mp4":
      return <VideoFile />;
    default:
      return <InsertDriveFile />;
  }
};
