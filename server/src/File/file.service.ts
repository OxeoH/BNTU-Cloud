import { Repository } from "typeorm";
import AppDataSource from "../../data-source";
import fs from "fs";
import { File } from "./file.entity";
import { CreateProps, FetchProps } from "./file.types";
import { User } from "../User/user.entity";
import userService from "../User/user.service";

class FileService {
  fileRepository: Repository<File>;
  userRepository: Repository<User>;

  constructor() {
    this.fileRepository = AppDataSource.getRepository<File>(File);
  }

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
    const { name, type, parent, user, path } = file;

    const newFile = this.fileRepository.create();
    newFile.name = name;
    newFile.type = type;
    newFile.user = user;
    newFile.path = path;
    newFile.parent = parent;
    newFile.childs = [];

    const createdFile = await this.fileRepository.save(newFile);
    const data = {
      ...createdFile,
      user: { ...user, files: [] },
      parent: { ...parent, childs: [], user: { ...user, files: [] } },
    };
    console.log("Created file from service: ", data);

    return data;
  }

  public async fetchFiles({
    user,
    parent,
  }: FetchProps): Promise<File[] | null> {
    const response = await this.fileRepository.find({
      where: { root: false },
      relations: ["parent"],
    });

    const files = response
      .map(
        (file) =>
          (file = {
            ...file,
            user: { ...user, files: [] },
            parent: { ...parent, childs: [] },
          })
      )
      .filter((file: File) => file.parent.id === parent.id);

    return files ?? null;
  }
}

export default new FileService();
