import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
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

  @Column("bigint", { default: BigInt(0) })
  size: bigint;

  @Column({ default: "" })
  path: string;

  @Column({ default: false })
  root: boolean;

  @CreateDateColumn({ type: "timestamp" })
  uploaded: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => File, (File) => File.id)
  parent: File;

  @OneToMany(() => File, (File) => File.id)
  childs: File[];

  @ManyToMany(() => User, (user) => user.shared)
  shared: User[];
}
