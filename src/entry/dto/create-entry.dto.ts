import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "../../categories/entities/category.entity";

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

    constructor(amount: number, date: Date, currency: string, name: string, comment: string, description: string, category?: Category){
        this.amount = amount;
        this.date = date;
        this.currency = currency;
        this.name = name;
        this.comment = comment;
        this.description = description;
        this.category = category
    } 
}
