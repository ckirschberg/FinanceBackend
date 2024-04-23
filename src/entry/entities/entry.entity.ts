import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Category } from "../../categories/entities/category.entity"
import { UserEntity } from "../../authentication/entities/user"

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

    @ManyToOne(() => UserEntity, (user) => user.entries, {
        eager: true
    })
    user: UserEntity


    @ManyToOne(() => Category, (category) => category.entries, {
        eager: true
    })
    category: Category
}
