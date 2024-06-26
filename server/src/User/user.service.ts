import { Repository } from "typeorm";
import AppDataSource from "../../data-source";
import { User } from "./user.entity";
import { AuthProps, RegisterProps, UserRole } from "./user.types";
import bcrypt from "bcryptjs";
import fileManager from "../File/file.manager";
import { File } from "../File/file.entity";
import fileService from "../File/file.service";
import { FileType } from "../File/file.types";
import { generateAccessToken } from "./utils/generateAccessToken";

class UserService {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository<User>(User);
  }

  public async checkIsNewUser(login: string, email: string, exclude?: string) {
    let candidates = [
      await this.userRepository.find({
        where: { login },
        relations: { shared: false, contacts: false },
      }),
      await this.userRepository.find({
        where: { email },
        relations: { shared: false, contacts: false },
      }),
    ];

    if (exclude) {
      candidates = [
        candidates[0].filter((user) => user.id !== exclude),
        candidates[1].filter((user) => user.id !== exclude),
      ];
    }

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
          }, {}) as User,
        users: users ? users.filter((u) => u.id !== user.id) : [],
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

  public async createRootAdmin(registerParams: RegisterProps) {
    try {
      const { name, surname, patronymic, login, email, password, role } =
        registerParams;
      const isRootAdminExists = await this.userRepository.findOne({
        where: { login: login },
      });
      //console.log(isRootAdminExists);

      if (!isRootAdminExists) {
        const rootAdmin = await this.createNewUser({
          name,
          surname,
          patronymic,
          login,
          email,
          password,
          role,
        });
        console.log(
          rootAdmin
            ? "Root admin was created successfully"
            : "Error: Root admin was not created"
        );
      }
    } catch (e) {
      return null;
    }
  }
}

export default new UserService();
