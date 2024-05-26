import { DeleteResult, Repository, SelectQueryBuilder } from "typeorm";
import AppDataSource from "../../data-source";
import bcrypt from "bcryptjs";
import fileManager from "../File/file.manager";
import { File } from "../File/file.entity";
import fileService from "../File/file.service";
import { FileType } from "../File/file.types";
import { Share } from "./share.entity";
import { User } from "../User/user.entity";

class ShareService {
  shareRepository: Repository<Share>;

  constructor() {
    this.shareRepository = AppDataSource.getRepository<Share>(Share);
  }

  public async checkIsNewShare(owner: string, toUser: string, file: string) {
    const queryBuilder: SelectQueryBuilder<Share> = this.shareRepository
      .createQueryBuilder("share")
      .leftJoinAndSelect("share.fromUser", "fromUser")
      .leftJoinAndSelect("share.toUser", "toUser")
      .leftJoinAndSelect("share.file", "file")
      .where(
        "fromUser.id = :owner AND toUser.id = :toUser AND file.id = :file",
        {
          owner,
          toUser,
          file,
        }
      );

    const userShare = await queryBuilder.getOne();
    console.log(userShare);

    if (!userShare) {
      return null;
    }
    return userShare;
  }

  public async getShareById(userId: string) {
    // const candidate = await this.userRepository.findOne({
    //   where: { id: userId },
    // });
    // if (candidate) {
    //   candidate.files = candidate.files.sort((a, b) =>
    //     a.root === b.root ? 0 : a.root ? -1 : 1
    //   );
    //   candidate.contacts = [];
    // }
    // return candidate ?? null;
  }

  // const { login, password, email, surname, patronymic, group, role, name } =
  //   registerParams;
  // const newUser = this.userRepository.create();
  // newUser.login = login;
  // newUser.password = password;
  // newUser.email = email;
  // newUser.name = name;
  // newUser.surname = surname;
  // newUser.patronymic = patronymic;
  // newUser.group = role === UserRole.STUDENT ? group! : "";
  // newUser.role = role;
  // newUser.confirmed = false;
  // newUser.avatar = "";
  // newUser.contacts = [];
  // newUser.shared = [];
  // const createdUser = await this.userRepository.save(newUser);
  // const userDir = new File();
  // userDir.user = createdUser;
  // userDir.name = createdUser.id;
  // userDir.path = "";
  // userDir.type = FileType.DIR;
  // userDir.childs = [];
  // userDir.access_link = "";
  // userDir.root = true;
  // await fileManager.createDirOrFile(userDir);
  // await fileService.createNewFile(userDir);
  // const token = generateAccessToken(createdUser.id, createdUser.login);
  // return token;

  public async createNewShare(owner: User, toUser: User, file: File) {
    const share = new Share();
    share.fromUser = owner;
    share.toUser = toUser;
    share.file = file;

    const newShare = await this.shareRepository.save(share);

    return newShare ?? null;
  }

  public async removeShare(
    owner: string,
    toUser: string,
    file: string
  ): Promise<DeleteResult | null> {
    const deleteFirstQuery = this.shareRepository
      .createQueryBuilder()
      .delete()
      .where(
        "fromUser.id = :owner AND toUser.id = :toUser AND file.id = :file",
        {
          owner,
          toUser,
          file,
        }
      );

    const deleteFirstResult = await deleteFirstQuery.execute();

    if (deleteFirstResult) {
      return deleteFirstResult;
    }

    return null;
  }

  public async getUserShares(user: User) {
    console.log("china");

    const queryBuilder: SelectQueryBuilder<Share> = this.shareRepository
      .createQueryBuilder("share")
      .leftJoinAndSelect("share.fromUser", "fromUser")
      .leftJoinAndSelect("share.toUser", "toUser")
      .leftJoinAndSelect("share.file", "file")
      .where("fromUser.id = :userId", {
        userId: user.id,
      });
    const userShares = await queryBuilder.getMany();

    return userShares ?? null;
  }

  public async getAll() {
    try {
      const shares = await this.shareRepository.find();

      if (!shares) {
        return null;
      }

      return shares;
    } catch (e) {
      return null;
    }
  }
}

export default new ShareService();
