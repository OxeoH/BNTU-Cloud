import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../User/user.entity";
import { File } from "../File/file.entity";

@Entity()
export class Share {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  fromUser: User;

  @ManyToOne(() => User, (user) => user.id)
  toUser: User;

  @ManyToOne(() => File, (file) => file.id)
  file: File;
}
