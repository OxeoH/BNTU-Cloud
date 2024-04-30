import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "../User/user.entity";
import { FileType } from "./file.types";

@Entity()
export class File {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ default: FileType.DIR })
  type: FileType;

  @Column({ default: "" })
  access_link: string;

  @Column("bigint", { default: "0" })
  size: bigint;

  @Column({ default: "" })
  path: string;

  @Column({ default: false })
  root: boolean;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => File, (File) => File.id)
  parent: File;

  @OneToMany(() => File, (File) => File.id)
  childs: File[];
}
