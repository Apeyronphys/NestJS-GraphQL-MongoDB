import { IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class UpdateStudentDto {
        
    @IsOptional()
    @IsNotEmpty()
    firstName: string; 
    
    @IsOptional()
    @IsNotEmpty()
    lastName: string;
    
    @IsOptional()
    @IsOptional()
    @IsUUID("4", { each: true })
    lessons: string[]; 

    @IsOptional()
    @IsOptional()
    @IsUUID("4", { each: true })
    friends: string[]; 
}