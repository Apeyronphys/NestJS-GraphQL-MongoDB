import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateLessonDto{
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    startDate: string;

    @IsNotEmpty()
    endDate: string; 

    @IsOptional()
    @IsUUID("4", { each: true })
    students: string[];
} 