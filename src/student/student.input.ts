import { InputType, Field, ID } from "@nestjs/graphql";
import { MinLength, IsUUID, IsOptional } from "class-validator";

@InputType()
export class CreateStudentInput{
    @MinLength(1)
    @Field()
    firstName: string; 

    @MinLength(1)
    @Field()
    lastName: string; 

    @IsOptional()
    @IsUUID("4", { each: true })
    @Field(() => [ID], { defaultValue: []})
    lessons: string[];

    @IsOptional()
    @IsUUID("4", { each: true })
    @Field(() => [ID], { defaultValue: []})
    friends: string[];
}