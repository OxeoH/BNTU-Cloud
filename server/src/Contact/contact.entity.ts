import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../User/user.entity";

@Entity()
export class Contact {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
  user: User;

  @ManyToOne(() => User, { onDelete: "CASCADE", eager: true })
  contactUser: User;
}
