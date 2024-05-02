import { Repository } from "typeorm";
import AppDataSource from "../../data-source";
import fs from "fs";
import { File } from "./file.entity";
import { CreateProps, FetchProps, FileType } from "./file.types";
import { User } from "../User/user.entity";

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
    const { name, type, parent, user, path, root, size } = file;

    const newFile = this.fileRepository.create();
    newFile.name = name;
    newFile.type = type;
    newFile.user = user;
    newFile.path = path;
    newFile.parent = parent;
    newFile.childs = [];
    newFile.root = root;
    newFile.size = size;

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
      where: { root: false, user: { id: user.id } },
      relations: ["parent"],
    });

    const files = response
      .map(
        (file) =>
          (file = {
            ...file,
            user: { ...file.user, files: [] as File[] },
            parent: { ...file.parent, childs: [] as File[] },
          })
      )
      .filter((file: File) => file.parent.id === parent.id);

    const withSizes = await this.getSizes({ user, filesArr: files });
    return withSizes ?? [];
  }
  public async getSizes({
    user,
    filesArr,
  }: {
    user: User;
    filesArr: File[];
  }): Promise<File[] | null> {
    let files: File[] = [];
    for (let i = 0; i < filesArr.length; i++) {
      const updateSize = async (id: string) => {
        const sizesSum = (
          await this.fileRepository.find({
            where: {
              parent: { id: filesArr[i].id },
              user: { id: user.id },
            },
          })
        ).reduce((sum, child) => BigInt(sum) + BigInt(child.size), 0n);

        await this.fileRepository
          .createQueryBuilder()
          .update(File)
          .set({
            size: sizesSum,
          })
          .where("id = :id", { id })
          .execute();

        return sizesSum;
      };

      const withSize =
        filesArr[i].type === FileType.DIR
          ? {
              ...filesArr[i],
              size: await updateSize(filesArr[i].id),
            }
          : filesArr[i];

      files.push(withSize);
    }

    return files;
  }
}

export default new FileService();
