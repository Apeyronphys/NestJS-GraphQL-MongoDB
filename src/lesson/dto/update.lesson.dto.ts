import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class UpdateLessonDto{
    @IsOptional()
    @IsNotEmpty()
    name: string;
    
    @IsOptional()
    @IsNotEmpty()
    startDate: string;
    
    @IsOptional()
    @IsNotEmpty()
    endDate: string; 

    @IsOptional()
    @IsUUID("4", { each: true })
    students: string[];
} 