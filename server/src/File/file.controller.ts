import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { File } from "./file.entity";
import fs from "fs";
import fileService from "./file.service";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import userService from "../User/user.service";
import { FileProps } from "./file.types";
import fileManager from "./file.manager";

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

      if (parent) {
        file.path = `${parent.path}\\${file.name}`;
        file.parent = parent;
        console.log(parent);

        parent.childs.push(file);
      }

      await fileManager.createDir(file);

      const newFile = fileService.saveFile(file);

      if (!newFile)
        return res.status(400).json({ message: "Error: File wasn't created" });

      return res.status(200).json(newFile);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: `Error: ${e}` });
    }
    //   const { login, password }: AuthProps = req.body;
    //   if (!password || !login) {
    //     res
    //       .status(400)
    //       .json({ message: "Error: Login and password are requared" });
    //   }
    //   const userData = await userService.authorizeUser({
    //     login,
    //     password,
    //   });
    //   if (!userData || !userData.token.length) {
    //     return res.status(404).json({ message: "User not found" });
    //   }
    //   res.status(200).json(userData);
  }
}

export default new FileController();
