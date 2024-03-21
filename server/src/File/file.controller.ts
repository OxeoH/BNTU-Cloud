import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { File } from "./file.entity";
import fs from "fs";
import fileService from "./file.service";

class FileController {
  constructor() {}

  public async createNewDir(req: Request, res: Response) {
    try {
      const { name, type, parent, path, user }: File = req.body;
      const newFile = fileService.createNewFile({
        name,
        type,
        parent,
        path,
        user,
      });
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

  public async checkIsAuth(req: Request, res: Response) {
    try {
      //   const token = req.headers.authorization?.split(" ")[1];
      //   if (!token)
      //     return res.status(401).json({ message: "Error: Wrong token" });
      //   const userData = verifyTokenMiddleware(token);
      //   if (!userData)
      //     return res.status(403).json({ message: "Error: Token was expired" });
      //   const user = await userService.getUserById(userData.id);
      //   if (!user)
      //     return res.status(400).json({ message: "Error: Cannot find user" });
      //   return res
      //     .status(200)
      //     .json({ token, user: (({ password, ...o }) => o)(user) });
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async registerUser(req: Request, res: Response) {
    try {
      //   const registerParams: RegisterProps = req.body;
      //   // const empties = Object.values(registerParams).filter((param) => {
      //   //   return param.toString().trim().length === 0;
      //   // });
      //   const candidate = await userService.checkIsNewUser(registerParams.login);
      //   if (!candidate) {
      //     return res.status(400).json({
      //       message: `User with login ${registerParams.login} is already exists`,
      //     });
      //   }
      //   const hashPassword = bcrypt.hashSync(
      //     registerParams.password,
      //     this.hashSalt
      //   );
      //   const token = await userService.createNewUser({
      //     ...registerParams,
      //     password: hashPassword,
      //   });
      //   if (token) {
      //     return res.status(200).json({
      //       message: `User was created`,
      //     });
      //   } else {
      //     return res.status(400).json({
      //       message: `User with login ${registerParams.login} is already exists`,
      //     });
      //   }
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }
}

export default new FileController();
