import { InputType, Field, ID } from "@nestjs/graphql";
import { MinLength, IsDateString, IsUUID, IsOptional } from 'class-validator'; 

@InputType()
export class UpdateLessonInput {
    @IsOptional()
    @MinLength(1)
    @Field()
    name: string;

    @IsOptional()
    @IsDateString()
    @Field()
    startDate: string; 

    @IsOptional()
    @IsDateString()
    @Field()
    endDate: string; 

    @IsOptional()
    @IsUUID("4", { each: true })
    @Field(() => [ID], { defaultValue: []})
    students: string[]; 
}