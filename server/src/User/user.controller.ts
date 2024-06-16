import { Request, Response } from "express";
import userService from "./user.service";
import {
  AuthProps,
  ChangePasswordProps,
  ChangeProfileProps,
  RegisterProps,
  UserRole,
} from "./user.types";
import bcrypt from "bcryptjs";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import checkEmail from "./utils/checkEmail";
import fileService from "../File/file.service";
import customJSONStringifier from "../File/utils/customJSONStringifier";
import contactService from "../Contact/contact.service";
import { generateAccessToken } from "./utils/generateAccessToken";

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
        return res.status(404).json({ message: "Error: User not found" });
      }

      const userContacts = await contactService.getUserContacts(userData.user);

      console.log(userContacts);

      userData.user.contacts = userContacts ?? [];

      res.status(200).send(customJSONStringifier(userData));
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async checkIsAuth(req: Request, res: Response) {
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

      return res.status(200).send(
        customJSONStringifier({
          token,
          user: (({ password, ...o }) => o)(user),
        })
      );
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
      const candidate = await userService.checkIsNewUser(
        registerParams.login,
        registerParams.email
      );

      if (!candidate) {
        return res.status(400).json({
          message: `User with login ${registerParams.login} or email ${registerParams.email} is already exists`,
        });
      }

      const hashPassword = bcrypt.hashSync(
        registerParams.password,
        this.hashSalt
      );

      const token = await userService.createNewUser({
        ...registerParams,
        password: hashPassword,
        role:
          registerParams.role === UserRole.ADMIN
            ? UserRole.STUDENT
            : registerParams.role,
      });

      if (token) {
        return res.status(200).json({
          message: `User was created`,
        });
      } else {
        return res.status(400).json({
          message: `Error: User with login ${registerParams.login} is already exists`,
        });
      }
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async registerRootAdmin() {
    try {
      const adminLogin = process.env.ADMIN_LOGIN ?? "admin";
      const adminPassword = process.env.ADMIN_PASSWORD ?? "adminadmin";

      const hashPassword = bcrypt.hashSync(adminPassword, this.hashSalt);

      const registerParams: RegisterProps = {
        login: adminLogin,
        password: hashPassword,
        email: "",
        name: "",
        surname: "",
        patronymic: "",
        role: UserRole.ADMIN,
      };

      await userService.createRootAdmin(registerParams);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }
  public async changePassword(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const userData = verifyTokenMiddleware(token ?? "");

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const candidate = await userService.getUserById(userData.id);

      if (!candidate)
        return res.status(404).json({ message: "Error: User not found" });

      const { oldPassword, newPassword }: ChangePasswordProps = req.body;

      const validPassword = bcrypt.compareSync(oldPassword, candidate.password);

      if (!validPassword)
        return res
          .status(403)
          .json({ message: "Error: The old password isn't correct" });

      const newHashed = bcrypt.hashSync(newPassword, this.hashSalt);

      candidate.password = newHashed;

      const savedUser = await userService.saveUser(candidate);
      console.log("Saved User: ", savedUser);

      if (!savedUser) {
        return res.status(400).json({
          message: `Error: Cannot save user info`,
        });
      }

      const newToken = generateAccessToken(savedUser.id, savedUser.login);

      if (!newToken)
        return res.status(400).json({
          message: `Error: Cannot generate access token`,
        });

      res.status(200).send(customJSONStringifier({ token: newToken }));
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async changeUserInfo(req: Request, res: Response) {
    try {
      const {
        name,
        surname,
        patronymic,
        login,
        email,
        group,
        role,
      }: ChangeProfileProps = req.body;

      const token = req.headers.authorization?.split(" ")[1];
      const userData = verifyTokenMiddleware(token ?? "");

      if (!userData)
        return res.status(403).json({ message: "Error: Token was expired" });

      const candidate = await userService.getUserById(userData.id);

      if (!candidate)
        return res.status(404).json({ message: "Error: User not found" });

      const checkCandidate = await userService.checkIsNewUser(
        login,
        email,
        candidate.id
      );

      if (!checkCandidate) {
        return res.status(400).json({
          message: `User with login ${login} or email ${email} is already exists`,
        });
      }

      candidate.name = name;
      candidate.surname = surname;
      candidate.patronymic = patronymic;
      candidate.login = login;
      candidate.email = email;
      candidate.group = group;
      candidate.role = role;
      candidate.confirmed = false;

      const savedUser = await userService.saveUser(candidate);
      console.log("Saved User: ", savedUser);

      if (!savedUser) {
        return res.status(400).json({
          message: `Error: Cannot save user info`,
        });
      }

      return res
        .status(200)
        .send(customJSONStringifier((({ password, ...o }) => o)(savedUser)));
    } catch (e) {
      res.status(500).json({ message: `Error: ${e}` });
    }
  }

  public async getAllUsers(req: Request, res: Response) {
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

      const users = await userService.getAll();

      if (!users)
        return res.status(400).json({ message: "Error: Cannot get users" });

      return res
        .status(200)
        .send(
          customJSONStringifier(
            users
              .map((item) => (({ password, ...o }) => o)(item))
              .filter((u) => u.id !== user.id)
          )
        );
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
