import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { File } from "../File/file.entity";

export enum UserRole {
  ADMIN = "admin",
  TEACHER = "teacher",
  STUDENT = "student",
}

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

  @Column()
  diskSpace: number;

  @Column()
  usedSpace: number;

  @OneToMany(() => File, (file: File) => file.user, {
    eager: true,
  })
  @JoinTable()
  files: File[];
}
