import { Request, Response } from "express";
import userService from "./user.service";
import { AuthProps, RegisterProps } from "./user.types";
import bcrypt from "bcryptjs";
import { verifyTokenMiddleware } from "./userMiddleware/verifyTokenMiddleware";
import checkEmail from "./utils/checkEmail";

class UserController {
  hashSalt: number;

  constructor() {
    this.hashSalt = 8;
  }

  public async authUser(req: Request, res: Response) {
    try {
      const { login, password }: AuthProps = req.body;

      if (!password || !login) {
        res
          .status(400)
          .json({ message: "Error: Login and password are requared" });
      }

      const userData = await userService.authorizeUser({
        login,
        password,
      });

      if (!userData || !userData.token.length) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(userData);
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async checkIsAuth(req: Request, res: Response) {
    try {
      const { token }: { token: string } = req.body;

      const userData = verifyTokenMiddleware(token);

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const user = await userService.getUserById(userData.id);

      if (!user)
        return res.status(400).json({ message: "Error: Cannot find user" });

      return res.status(200).json({ token });
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async registerUser(req: Request, res: Response) {
    try {
      const registerParams: RegisterProps = req.body;

      // const empties = Object.values(registerParams).filter((param) => {
      //   return param.toString().trim().length === 0;
      // });

      const candidate = await userService.checkIsNewUser(registerParams.login);

      if (!candidate) {
        return res.status(400).json({
          message: `User with login ${registerParams.login} is already exists`,
        });
      }

      const hashPassword = bcrypt.hashSync(
        registerParams.password,
        this.hashSalt
      );

      const token = await userService.createNewUser({
        ...registerParams,
        password: hashPassword,
      });

      if (token) {
        return res.status(200).json({
          message: `User was created`,
        });
      } else {
        return res.status(400).json({
          message: `User with login ${registerParams.login} is already exists`,
        });
      }
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }
  public async checkIsAdmin(req: Request, res: Response) {
    try {
      const { token }: { token: string } = req.body;

      const userData = verifyTokenMiddleware(token);

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const user = await userService.getUserById(userData.id);

      if (!user)
        return res.status(403).json({ message: "Error: Cannot find user" });

      if (user.role != "admin")
        return res.status(404).json({ message: "Error: No roots" });

      return res.status(200).json(user.role);
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }
}

export default new UserController();
