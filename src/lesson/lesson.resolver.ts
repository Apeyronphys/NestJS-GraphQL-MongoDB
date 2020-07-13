import { Resolver, Query, Mutation, Args, ResolveField, Parent } from "@nestjs/graphql";
import { LessonType } from "./lesson.type";
import { LessonService } from "./lesson.service";
import { CreateLessonInput } from "./lesson.input";
import { StudentService } from "../student/student.service";
import { Lesson } from "./lesson.entity";
import { UpdateLessonInput } from "./lesson.input.update";

@Resolver(of => LessonType)
export class LessonResolver{
    constructor(
        private lessonService: LessonService,
        private studentService: StudentService,
    ){}

    @Query(() => LessonType)
    lesson(
        @Args('id') id: string,
    ){
        return this.lessonService.getLesson(id);
    }

    @Query(() => [LessonType])
    getLessons(){
        return this.lessonService.getLessons();
    }

    @Query(() => [LessonType])
    deleteLesson(
        @Args('id') id: string,
    ){
        return this.lessonService.deleteLesson(id); 
    }

    @Mutation(() => LessonType)
    createLesson(
        @Args('createLessonInput') createLessonInput: CreateLessonInput,
    ){
        return this.lessonService.createLesson(createLessonInput);
    }

    @Mutation(() => LessonType)
    updateLesson(
        @Args('id') id: string,
        @Args('updateLessonInput') updateLessonInput: UpdateLessonInput, 
    ){
        return this.lessonService.updateLesson(id, updateLessonInput);
    }   

    // @Mutation(() => LessonType)
    // assignStudentsToLesson(
    //     @Args('assignStudentsToLessonInput') 
    //     assignStudentsToLessonInput: AssignStudentsToLessonInput,
    // ){
    //     const { lessonID, studentsIDs} = assignStudentsToLessonInput;
    //     return this.lessonService.assignStudentsToLesson(lessonID, studentsIDs);
    // }

    @ResolveField()
    async students(@Parent() lesson: Lesson){
        return this.studentService.getManyStudents(lesson.students);
    }
}