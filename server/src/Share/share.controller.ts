import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

import customJSONStringifier from "../File/utils/customJSONStringifier";
import { User } from "../User/user.entity";
import { File } from "../File/file.entity";
import { FileType } from "../File/file.types";
import { Share } from "./share.entity";
import userService from "../User/user.service";
import shareService from "./share.service";
import fileService from "../File/file.service";

class ShareController {
  // public async authUser(req: Request, res: Response) {
  //   try {
  //     const { login, password }: AuthProps = req.body;
  //     if (!password || !login) {
  //       res
  //         .status(400)
  //         .json({ message: "Error: Login and password are requared" });
  //     }
  //     const userData = await userService.authorizeUser({
  //       login,
  //       password,
  //     });
  //     if (!userData || !userData.token.length) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  //     res.status(200).send(customJSONStringifier(userData));
  //   } catch (e) {
  //     res.status(500).json({ message: `Error: ${e}` });
  //   }
  // }
  // public async checkIsAuth(req: Request, res: Response) {
  //   try {
  //     const token = req.headers.authorization?.split(" ")[1];
  //     if (!token)
  //       return res.status(401).json({ message: "Error: Wrong token" });
  //     const userData = verifyTokenMiddleware(token);
  //     if (!userData)
  //       return res.status(403).json({ message: "Error: Token was expired" });
  //     const user = await userService.getUserById(userData.id);
  //     if (!user)
  //       return res.status(400).json({ message: "Error: Cannot find user" });
  //     return res.status(200).send(
  //       customJSONStringifier({
  //         token,
  //         user: (({ password, ...o }) => o)(user),
  //       })
  //     );
  //   } catch (e) {
  //     res.status(500).json({ message: `Error: ${e}` });
  //   }
  // }
  public async createShare(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res.status(401).json({ message: "Error: Wrong token" });

      const { fileId, toUser }: { fileId: string; toUser: string } = req.body;
      if (!fileId || !toUser)
        return res.status(400).json({ message: "Error: Bad params" });

      const userData = verifyTokenMiddleware(token);
      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const user = await userService.getUserById(userData.id);
      if (!user)
        return res.status(400).json({ message: "Error: Cannot find user" });

      const userToShare = await userService.getUserById(toUser);
      if (!userToShare)
        return res
          .status(400)
          .json({ message: "Error: Cannot find user to share" });

      const fileToShare = await fileService.getFileById(fileId);
      if (!fileToShare)
        return res
          .status(400)
          .json({ message: "Error: Cannot find file to share" });

      const isNewShare = await shareService.checkIsNewShare(
        user.id,
        userToShare.id,
        fileId
      );

      if (isNewShare) {
        return res
          .status(400)
          .json({ message: "Error: Sharing is already exists" });
      }

      async function shareDirectory(
        owner: User,
        directory: File,
        toUser: User
      ) {
        // Добавляем шэринг для самой директории
        const dirShare = await shareService.createNewShare(
          owner,
          toUser,
          directory
        );

        // Рекурсивно обходим все файлы и директории внутри этой директории
        for (const file of directory.childs) {
          if (file.type === FileType.DIR) {
            await shareDirectory(owner, file, toUser);
          } else {
            await shareService.createNewShare(owner, toUser, file);
          }
        }
        console.log("SHared Shared: ", dirShare);

        return dirShare;
      }

      const sharedDirectory = await shareDirectory(
        user,
        fileToShare,
        userToShare
      );

      if (!shareDirectory) {
        res.status(400).json({ message: "Error: Cannot share this file" });
      }

      res.status(200).send(customJSONStringifier(shareDirectory));
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async removeShare(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res.status(401).json({ message: "Error: Wrong token" });

      const { fileId, toUser }: { fileId: string; toUser: string } = req.body;
      if (!fileId || !toUser)
        return res.status(400).json({ message: "Error: Bad params" });

      const userData = verifyTokenMiddleware(token);
      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const user = await userService.getUserById(userData.id);
      if (!user)
        return res.status(400).json({ message: "Error: Cannot find user" });

      const userToShare = await userService.getUserById(toUser);
      if (!userToShare)
        return res
          .status(400)
          .json({ message: "Error: Cannot find user to share" });

      const fileToShare = await fileService.getFileById(fileId);
      if (!fileToShare)
        return res
          .status(400)
          .json({ message: "Error: Cannot find file to share" });

      const response = await shareService.checkIsNewShare(
        user.id,
        userToShare.id,
        fileId
      );

      if (!response) {
        return res.status(400).json({ message: "Error: Cannot find sharing" });
      }

      const removed = await shareService.removeShare(
        user.id,
        userToShare.id,
        fileId
      );

      if (!removed)
        return res
          .status(400)
          .json({ message: "Error: Cannot remove sharing" });

      return res.status(200).send(customJSONStringifier(response));
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }
  public async getAllUserShares(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token)
        return res.status(401).json({ message: "Error: Wrong token" });

      const userData = verifyTokenMiddleware(token);
      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const user = await userService.getUserById(userData.id);
      if (!user)
        return res.status(400).json({ message: "Error: Cannot find user" });

      const userShares = await shareService.getUserShares(user);
      res.status(200).send(customJSONStringifier(userShares ?? []));
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }
}

export default new ShareController();
