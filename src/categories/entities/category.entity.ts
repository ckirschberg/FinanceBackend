import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Entry } from "../../entry/entities/entry.entity"
import { IsOptional } from "class-validator"

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    name: string


    @OneToMany(() => Entry, (entry) => entry.category)
    entries: Entry[]
}
