import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Category } from "../../categories/entities/category.entity"

@Entity()
export class Entry {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    amount: number

    @Column()
    date: Date

    @Column()
    currency: string

    @Column()
    name: string

    @Column()
    comment: string

    @Column() 
    description: string

    @Column() 
    photo: string

    @ManyToOne(() => Category, (category) => category.entries, {
        eager: true
    })
    category: Category
}
