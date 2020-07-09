import { InputType, Field, ID } from "@nestjs/graphql";
import { MinLength, IsUUID } from "class-validator";

@InputType()
export class CreateStudentInput{
    @MinLength(1)
    @Field()
    firstName: string; 

    @MinLength(1)
    @Field()
    lastName: string; 

    @IsUUID("4", { each: true })
    @Field(() => [ID], { defaultValue: []})
    lessons: string[];
}