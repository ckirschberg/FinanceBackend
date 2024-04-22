import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "../../categories/entities/category.entity";
import { UserEntity } from "../../authentication/entities/user";

export class CreateEntryDto {

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    @IsString()
    currency: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    comment: string

    @IsNotEmpty()
    @IsString()
    description: string

    category: Category;

    photo: any;

    user: any;

    constructor(amount: number, date: Date, currency: string, name: string, comment: string, description: string, category?: Category, photo?: any){
        this.amount = amount;
        this.date = date;
        this.currency = currency;
        this.name = name;
        this.comment = comment;
        this.description = description;
        this.category = category
        this.photo = photo;
    } 
}
