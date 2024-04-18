import { Repository } from "typeorm";
import AppDataSource from "../../data-source";
import fs from "fs";
import { File } from "./file.entity";
import { CreateProps } from "./file.types";
import { User } from "../User/user.entity";
import userService from "../User/user.service";

class FileService {
  fileRepository: Repository<File>;
  userRepository: Repository<User>;

  constructor() {
    this.fileRepository = AppDataSource.getRepository<File>(File);
  }

  //   public async checkIsNewUser(login: string) {
  //     const candidate = await this.fileRepository.find({ where: { login } });

  //     if (candidate.length === 0) {
  //       return true;
  //     }
  //     return false;
  //   }

  public async getFileById(fileId: string) {
    const candidate = await this.fileRepository.findOne({
      where: { id: fileId },
    });

    if (candidate) {
      const childsList: File[] = await this.fileRepository.find({
        where: { parent: candidate },
      });
      candidate.childs = childsList.length ? childsList : [];

      return candidate;
    }

    return null;
  }

  public async createNewFile(file: CreateProps): Promise<File | null> {
    const { name, type, parent, user } = file;

    const newFile = this.fileRepository.create();
    newFile.name = name;
    newFile.type = type;
    newFile.user = user;
    newFile.parent = parent;
    newFile.childs = [];

    const createdFile = await this.fileRepository.save(newFile);
    return createdFile;
  }

  public async saveFile(file: File): Promise<File | null> {
    // const newFile = this.fileRepository.create(file);
    // console.log("NewFile from savefile: ", newFile);

    const createdFile = await this.fileRepository.save(file);
    console.log("CreatedFile from savefile: ", createdFile);
    return createdFile;
  }

  // public async authorizeUser() {
  //   try {
  //   const user = await this.userRepository.findOne({
  //     where: { login: authParams.login },
  //   });
  //   if (!user) {
  //     return null;
  //   }
  //   const validPassword = bcrypt.compareSync(
  //     authParams.password,
  //     user.password
  //   );
  //   if (!validPassword) {
  //     return null;
  //   }
  //   const token = generateAccessToken(user.id, user.login);
  //   return {
  //     token,
  //     user: Object.keys(user)
  //       .filter((key) => key !== "password")
  //       .reduce((res, key) => {
  //         res[key] = user[key];
  //         return res;
  //       }, {}),
  //   };
  //   } catch (e) {
  //     return null;
  //   }
  // }
}

export default new FileService();
