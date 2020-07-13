import { Resolver, Mutation, Args, Query, ResolveField, Parent } from "@nestjs/graphql";
import { StudentType } from "./student.type";
import { StudentService } from "./student.service";
import { CreateStudentInput } from "./student.input";
import { LessonService } from "../lesson/lesson.service";
import { Student } from "./student.entity";
import { UpdateStudentInput } from "./student.input.update";

@Resolver(of => StudentType)
export class StudentResolver {
    constructor(
        private studentService: StudentService,
        private lessonService: LessonService, 
    ){}

    @Query(() => StudentType)
    async student(
        @Args('id') id: string,
    ){
        return this.studentService.getStudentById(id);
    }

    @Query(() => [StudentType])
    async students(){
        return this.studentService.getStudents();
    }

    @Mutation(() => StudentType)
    async createStudent(
        @Args('createStudentInput') createStudentInput: CreateStudentInput,
    ){
        return this.studentService.createStudent(createStudentInput);
    }

    @Mutation(() => StudentType)
    updateStudent(
        @Args('id') id: string,
        @Args('updateStudentInput') updateStudentInput: UpdateStudentInput,
    ){
        return this.studentService.updateStudent(id, updateStudentInput);
    }

    @Mutation(() => StudentType)
    deleteStudent(
        @Args('id') id: string,
    ){
        return this.studentService.deleteStudent(id);
    }

    @ResolveField()
    async lessons(@Parent() student: Student){
        return this.lessonService.getManyLessons(student.lessons);
    }


    // @Mutation(() => StudentType)
    // async assignLessonsToStudents(
    //     @Args('assignStudentsToLesson')
    //     assignLessonsToStudents: AssignStudentsToLessonInput,
    // ){
    //     const { studentID, lessonsIDs } = assignLessonsToStudents; 
    //     return this.studentService.assignLessonsToStudents(studentID, lessonsIDs);
    // }

}