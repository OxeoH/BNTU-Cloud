import {
  DeleteQueryBuilder,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  getManager,
} from "typeorm";
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
      relations: ["user"],
    });

    if (candidate) {
      const childsList: File[] = await this.fileRepository.find({
        where: { parent: { id: candidate.id } },
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
    newFile.shared = [];
    newFile.childs = [];
    newFile.root = root;
    newFile.size = size;

    const createdFile = await this.fileRepository.save(newFile);
    const data = {
      ...createdFile,
      user: { ...user, files: [] },
      parent: { ...parent, childs: [], user: { ...user, files: [] } },
    };

    return data;
  }

  public async deleteFile(file: File): Promise<File | null> {
    const queryBuilder: DeleteQueryBuilder<File> = this.fileRepository
      .createQueryBuilder("file")
      .delete()
      .where("file.id = :id", {
        id: file.id,
      });
    const fileToDelete = await queryBuilder.execute();
    console.log(fileToDelete);

    if (fileToDelete) {
      return file;
    }

    return null;
  }

  public async fetchFiles({
    user,
    parent,
  }: FetchProps): Promise<File[] | null> {
    const response = await this.fileRepository.find({
      where: { root: false, user: { id: user.id } },
      relations: ["parent", "user"],
    });

    const files = response
      .map(
        (file) =>
          (file = {
            ...file,
            user: { ...file.user, password: "", files: [] as File[] },
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

  public async recursiveDelete(id: string) {
    const file = await this.fileRepository.findOne({
      where: { id },
    });
    console.log("Current deleting: ", file);

    if (!file) {
      console.log("File not found");
      return null;
    }

    const querySelectBuilder: SelectQueryBuilder<File> = this.fileRepository
      .createQueryBuilder("file")
      .leftJoinAndSelect("file.parent", "parent")
      .where("parent.id = :parentId", {
        parentId: file.id,
      });
    const fileChilds = await querySelectBuilder.getMany();
    console.log("File childs: ", fileChilds);

    if (fileChilds && fileChilds.length > 0 && file.type === FileType.DIR) {
      for (const child of fileChilds) {
        await this.recursiveDelete(child.id);
      }
    }

    // await this.fileRepository.remove(file);
    const queryDeleteBuilder: DeleteQueryBuilder<File> = this.fileRepository
      .createQueryBuilder("file")
      .delete()
      .where("file.id = :id", {
        id: file.id,
      });
    const fileToDelete = await queryDeleteBuilder.execute();
    console.log(fileToDelete);

    if (fileToDelete) {
      return file;
    }

    return null;
  }
}

export default new FileService();
