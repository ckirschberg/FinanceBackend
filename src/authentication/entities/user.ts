import { Entry } from '../../entry/entities/entry.entity';
import { Role } from './../../users/role';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type:"enum", 
    enum: Role, 
    default: [Role.User]
  })
  role: Role;

  @OneToMany(() => Entry, (entry) => entry.user)
  entries: Entry[]
}