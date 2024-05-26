import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
  JoinColumn,
} from "typeorm";
import { File } from "../File/file.entity";
import { UserRole } from "./user.types";
import { Contact } from "../Contact/contact.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  patronymic: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column()
  group: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column()
  confirmed: boolean;

  @Column({ type: "bigint", default: BigInt(1024 ** 3 * 4) })
  diskSpace: bigint;

  @Column({ type: "bigint", default: BigInt(0) })
  usedSpace: bigint;

  @OneToMany(() => File, (file) => file.user, {
    eager: true,
  })
  @JoinTable()
  files: File[];

  @ManyToMany(() => File, { eager: true })
  @JoinTable()
  shared: File[];

  @ManyToMany(() => Contact, (contact) => contact.id)
  @JoinTable()
  contacts: Contact[];
}
