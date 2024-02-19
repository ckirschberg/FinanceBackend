import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Entry } from "../../entry/entities/entry.entity"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Entry, (entry) => entry.category)
    entries: Entry[]
}
