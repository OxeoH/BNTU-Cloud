import { Repository } from "typeorm";
import AppDataSource from "../../data-source";
import { User } from "./user.entity";
import { AuthProps, RegisterProps, UserRole } from "./user.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "./jwtConfig";
import fileManager from "../File/file.manager";
import { File } from "../File/file.entity";
import fileService from "../File/file.service";
import { FileType } from "../File/file.types";

const generateAccessToken = (id: string, login: string) => {
  const payload = {
    id,
    login,
  };

  return jwt.sign(payload, config.secret, { expiresIn: "24h" });
};

class UserService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository<User>(User);
  }

  public async checkIsNewUser(login: string) {
    const candidate = await this.userRepository.find({ where: { login } });

    if (candidate.length === 0) {
      return true;
    }
    return false;
  }

  public async getUserById(userId: string) {
    const candidate = await this.userRepository.findOne({
      where: { id: userId },
    });

    return candidate ?? null;
  }

  public async createNewUser(
    registerParams: RegisterProps
  ): Promise<string | null> {
    const { login, password, email, surname, patronymic, group, role, name } =
      registerParams;

    const newUser = this.userRepository.create();
    newUser.login = login;
    newUser.password = password;
    newUser.email = email;
    newUser.name = name;
    newUser.surname = surname;
    newUser.patronymic = patronymic;
    newUser.group = role === UserRole.STUDENT ? group! : "";
    newUser.role = role;
    newUser.confirmed = false;
    newUser.avatar = "";

    const createdUser = await this.userRepository.save(newUser);

    const userDir = new File();
    userDir.user = createdUser;
    userDir.name = createdUser.id;
    userDir.path = "";
    userDir.type = FileType.DIR;
    userDir.childs = [];
    userDir.access_link = "";

    await fileManager.createDir(userDir);
    await fileService.saveFile(userDir);

    const token = generateAccessToken(createdUser.id, createdUser.login);

    return token;
  }

  public async authorizeUser(authParams: AuthProps) {
    try {
      const user = await this.userRepository.findOne({
        where: { login: authParams.login },
      });

      if (!user) {
        return null;
      }

      const validPassword = bcrypt.compareSync(
        authParams.password,
        user.password
      );

      if (!validPassword) {
        return null;
      }

      const token = generateAccessToken(user.id, user.login);

      return {
        token,
        user: Object.keys(user)
          .filter((key) => key !== "password")
          .reduce((res, key) => {
            res[key] = user[key];
            return res;
          }, {}),
      };
    } catch (e) {
      return null;
    }
  }
}

export default new UserService();
