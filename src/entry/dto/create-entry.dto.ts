import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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

    constructor(amount: number, date: Date, currency: string, name: string, comment: string){
        this.amount = amount;
        this.date = date;
        this.currency = currency;
        this.name = name;
        this.comment = comment;
    } 
}
