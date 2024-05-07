import { Request, Response } from "express";
import { File } from "./file.entity";
import fileService from "./file.service";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import userService from "../User/user.service";
import { FileProps, FileType } from "./file.types";
import fileManager from "./file.manager";
import fileUpload from "express-fileupload";
import customJSONStringifier from "./utils/customJSONStringifier";

class FileController {
  constructor() {}

  public async createNewDir(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { name, type, parentId }: FileProps = req.body;

      const userData = verifyTokenMiddleware(token ?? "");

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const candidate = await userService.getUserById(userData.id);

      if (!candidate)
        return res.status(403).json({ message: "Error: User not found" });

      const parent = await fileService.getFileById(parentId);

      let file = new File();

      file.name = name;
      file.user = candidate;
      file.type = type;
      file.childs = [];
      file.root = false;
      file.path = name;

      if (parent) {
        file.path = `${parent.path}\\${file.name}`;
        file.parent = parent;

        parent.childs.push(file);
      }

      await fileManager.createDirOrFile(file);

      const newFile = await fileService.createNewFile(file);

      if (!newFile)
        return res.status(400).json({ message: "Error: File wasn't created" });

      return res.status(200).send(customJSONStringifier(newFile));
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: `Error: ${e}` });
    }
  }

  public async deleteFile(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { id }: { id: string } = req.body;

      const userData = verifyTokenMiddleware(token ?? "");

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const candidate = await userService.getUserById(userData.id);

      if (!candidate)
        return res.status(403).json({ message: "Error: User not found" });

      const fileToDelete = await fileService.getFileById(id);

      if (fileToDelete) {
        await fileManager.deleteFile(fileToDelete);
        const deleted = await fileService.deleteFile(fileToDelete.id);
        return res.status(200).send(customJSONStringifier(deleted));
      }
      return res.status(404).json({ message: "Error: File not found" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: `Error: ${e}` });
    }
  }
  public async fetchFiles(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const { parentId } = req.query;

      const userData = verifyTokenMiddleware(token ?? "");

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const user = await userService.getUserById(userData.id);

      if (!user)
        return res.status(403).json({ message: "Error: User not found" });

      const parent = await fileService.getFileById(`${parentId}`);

      if (!parent)
        return res.status(404).json({ message: "Error: Directory not found" });

      const files = await fileService.fetchFiles({
        user,
        parent,
      });

      if (!files)
        return res.status(404).json({ message: "Error: Files not found" });

      return res.status(200).send(customJSONStringifier(files));
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: `Error: ${e}` });
    }
  }

  public async uploadFile(req: Request, res: Response) {
    try {
      const uploadedFile = req.files?.file as fileUpload.UploadedFile;

      if (!uploadedFile)
        return res.status(400).json({ message: "Error: File not found" });

      const token = req.headers.authorization?.split(" ")[1];
      const { parentId }: { parentId: string } = req.body;

      const userData = verifyTokenMiddleware(token ?? "");

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const candidate = await userService.getUserById(userData.id);

      if (!candidate)
        return res.status(403).json({ message: "Error: User not found" });

      const parent = await fileService.getFileById(parentId);

      if (candidate.diskSpace - candidate.usedSpace < uploadedFile.size)
        return res
          .status(400)
          .json({ message: "Error: Need more storage space" });

      candidate.diskSpace = BigInt(candidate.diskSpace);
      candidate.usedSpace =
        BigInt(candidate.usedSpace) + BigInt(uploadedFile.size);

      let filePath = "";

      if (parent) {
        filePath =
          process.env.FILES_PATH +
          `\\${candidate.id}\\${parent.path}\\${uploadedFile.name}`;
      } else {
        filePath =
          process.env.FILES_PATH + `\\${candidate.id}\\${uploadedFile.name}`;
      }

      if (fileManager.checkIsExists(filePath))
        return res.status(400).json({ message: "Error: File already exists" });

      uploadedFile.mv(filePath);

      const type = uploadedFile.name.split(".").pop() as FileType;

      if (type && !Object.values(FileType).includes(type)) {
        return res.status(400).json({ message: "Error: Unknown type of file" });
      }

      let file = new File();

      file.name = uploadedFile.name;
      file.user = candidate;
      file.type = type;
      file.size = BigInt(uploadedFile.size);
      file.access_link = "";
      file.childs = [];
      file.root = false;

      if (parent) {
        file.path = `${parent.path}\\${file.name}`;
        file.parent = parent;
      }
      await userService.userRepository.save(candidate);
      const newFile = await fileService.createNewFile(file);

      if (!newFile)
        return res.status(400).json({ message: "Error: File wasn't created" });

      return res.status(200).send(customJSONStringifier(newFile));
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: `Error: ${e}` });
    }
  }

  public async downloadFile(req: Request, res: Response) {
    try {
      const downloadId = req.query.id ?? "";

      if (!downloadId)
        return res.status(400).json({ message: "Error: Incorrect files id" });

      const downloadingFile = await fileService.getFileById(`${downloadId}`);

      if (!downloadingFile)
        return res.status(400).json({ message: "Error: File not found" });

      const token = req.headers.authorization?.split(" ")[1];

      const userData = verifyTokenMiddleware(token ?? "");

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const candidate = await userService.getUserById(userData.id);

      if (!candidate)
        return res.status(403).json({ message: "Error: User not found" });

      const filePath =
        process.env.FILES_PATH +
        "\\" +
        candidate.id +
        downloadingFile.path +
        `.${downloadingFile.type}`;

      if (fileManager.checkIsExists(filePath)) {
        return res.status(200).download(filePath, downloadingFile.name);
      }
      return res.status(400).json({ message: "Error: File not found" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e });
    }
  }
}

export default new FileController();
