import { DeleteResult, Repository, SelectQueryBuilder } from "typeorm";
import AppDataSource from "../../data-source";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fileManager from "../File/file.manager";
import { File } from "../File/file.entity";
import fileService from "../File/file.service";
import { FileType } from "../File/file.types";
import { ContactProps } from "./contact.types";
import { Contact } from "./contact.entity";
import { User } from "../User/user.entity";

class ContactService {
  contactRepository: Repository<Contact>;

  constructor() {
    this.contactRepository = AppDataSource.getRepository<Contact>(Contact);
  }

  public async checkIsNewContact(user: User, contactUser: User) {
    const queryBuilder: SelectQueryBuilder<Contact> = this.contactRepository
      .createQueryBuilder("contact")
      .leftJoinAndSelect("contact.user", "user")
      .leftJoinAndSelect("contact.contactUser", "contactUser")
      .where("user.id = :userId AND contactUser.id = :contactId", {
        userId: user.id,
        contactId: contactUser.id,
      });

    const userContact = await queryBuilder.getOne();
    if (!userContact) {
      return null;
    }
    return userContact;
  }

  public async getContactById(contactId: string) {
    const candidate = await this.contactRepository.findOne({
      where: { id: contactId },
    });

    return candidate ?? null;
  }

  public async getUserContacts(user: User) {
    const queryBuilder: SelectQueryBuilder<Contact> = this.contactRepository
      .createQueryBuilder("contact")
      .leftJoinAndSelect("contact.user", "user")
      .leftJoinAndSelect("contact.contactUser", "contactUser")
      .where("user.id = :userId", {
        userId: user.id,
      });
    const userContacts = await queryBuilder.getMany();

    return userContacts ?? null;
  }

  public async addNewContact(props: ContactProps): Promise<Contact | null> {
    const { user, contact } = props;
    const contact1 = new Contact();
    contact1.user = user;
    contact1.contactUser = contact;
    await this.contactRepository.save(contact1);

    const contact2 = new Contact();
    contact2.user = contact;
    contact2.contactUser = user;
    await this.contactRepository.save(contact2);

    return contact1;
  }

  public async removeContact(
    props: ContactProps
  ): Promise<DeleteResult | null> {
    const { user, contact } = props;

    const deleteFirstQuery = this.contactRepository
      .createQueryBuilder()
      .delete()
      .where("user.id = :userId AND contactUser.id = :contactId", {
        userId: user.id,
        contactId: contact.id,
      });

    const deleteSecondQuery = this.contactRepository
      .createQueryBuilder()
      .delete()
      .where("user.id = :contactId AND contactUser.id = :userId", {
        userId: user.id,
        contactId: contact.id,
      });

    const deleteFirstResult = await deleteFirstQuery.execute();
    const deleteSecondResult = await deleteSecondQuery.execute();

    if (deleteSecondResult && deleteFirstResult) {
      return deleteFirstResult;
    }

    return null;
  }
}

export default new ContactService();
