import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateStudentDto {
    @IsNotEmpty()
    firstName: string; 

    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsUUID("4", { each: true })
    lessons: string[]; 

    @IsOptional()
    @IsUUID("4", { each: true })
    friends: string[];
}