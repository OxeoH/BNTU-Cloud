import { Repository } from "typeorm";
import AppDataSource from "../../data-source";
import fs from "fs";
import { File } from "./file.entity";
import { CreateProps } from "./file.types";

class FileService {
  fileRepository: Repository<File>;

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

    return candidate ?? null;
  }

  public async createNewFile(file: CreateProps): Promise<File | null> {
    const { name, type, user, parent } = file;
    const newFile = this.fileRepository.create();
    newFile.name = name;
    newFile.type = type;
    newFile.user = user;
    newFile.parent = parent;
    newFile.childs = [];

    const createdFile = await this.fileRepository.save(newFile);
    return createdFile;
  }

  public async authorizeUser() {
    try {
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
    } catch (e) {
      return null;
    }
  }
}

export default new FileService();
