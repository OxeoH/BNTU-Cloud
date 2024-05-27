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

  public async checkIsNewUser(login: string, email: string) {
    const candidates = [
      await this.userRepository.find({
        where: { login },
        relations: { shared: false, contacts: false },
      }),
      await this.userRepository.find({
        where: { email },
        relations: { shared: false, contacts: false },
      }),
    ];
    console.log(candidates);

    if (!candidates[0].length && !candidates[1].length) return true;

    return false;
  }

  public async getUserById(userId: string) {
    const candidate = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (candidate) {
      candidate.files = candidate.files.sort((a, b) =>
        a.root === b.root ? 0 : a.root ? -1 : 1
      );
      candidate.contacts = [];
    }

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
    newUser.contacts = [];
    newUser.shared = [];

    const createdUser = await this.userRepository.save(newUser);

    const userDir = new File();
    userDir.user = createdUser;
    userDir.name = createdUser.id;
    userDir.path = "";
    userDir.type = FileType.DIR;
    userDir.childs = [];
    userDir.access_link = "";
    userDir.root = true;

    await fileManager.createDirOrFile(userDir);

    await fileService.createNewFile(userDir);

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
      user.contacts = [];

      const token = generateAccessToken(user.id, user.login);

      const users = await this.getAll();

      return {
        token,
        user: Object.keys(user)
          .filter((key) => key !== "password")
          .reduce((res, key) => {
            res[key] = user[key];
            return res;
          }, {}),
        users: users ? users.filter((u) => u.id === user.id) : [],
      };
    } catch (e) {
      return null;
    }
  }

  public async getAll() {
    try {
      const users = await this.userRepository.find();

      if (!users) {
        return null;
      }

      return users;
    } catch (e) {
      return null;
    }
  }

  public async saveUser(user: User) {
    try {
      const saved = await this.userRepository.save(user);

      if (!saved) {
        return null;
      }

      return saved;
    } catch (e) {
      return null;
    }
  }
}

export default new UserService();
