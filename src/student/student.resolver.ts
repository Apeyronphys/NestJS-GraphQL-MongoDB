import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { StudentType } from "./student.type";
import { StudentService } from "./student.service";
import { CreateStudentInput } from "./student.input";

@Resolver(of => StudentType)
export class StudentResolver {
    constructor(
        private studentService: StudentService,
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

}