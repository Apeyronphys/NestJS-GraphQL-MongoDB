import { InputType, Field, ID } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType()
export class AssignStudentsToLessonInput{
    @IsUUID()
    @Field(() => ID)
    lessonID: string; 

    @IsUUID("4", { each: true })
    @Field(() => [ID])
    studentsIDs: string[]; 
}