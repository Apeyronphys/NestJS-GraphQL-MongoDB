import { ObjectType, Field, ID } from "@nestjs/graphql";
import { LessonType } from "src/lesson/lesson.type";

@ObjectType('Student')
export class StudentType {
    @Field(() => ID)
    id: string;

    @Field()
    firstName: string;

    @Field()
    lastName: string; 

    @Field(() => [LessonType])
    lessons: string[];
}