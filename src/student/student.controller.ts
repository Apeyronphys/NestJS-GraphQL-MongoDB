import { Controller, Get, Param, Post, UsePipes, ValidationPipe, Body, Patch, Delete } from "@nestjs/common";
import { StudentService } from "./student.service";
import { Student } from './student.entity'; 
import { CreateStudentDto } from "./dto/create.student.dto";
import { UpdateStudentDto } from './dto/update.student.dto';

@Controller('student')
export class StudentController{
    constructor(
        private studentService: StudentService, 
    ){}

    @Get()
    getStudents(): Promise<Student[]>{
        return this.studentService.getStudents(); 
    }

    @Get('/:id')
    getStudent(@Param('id') id: string): Promise<Student>{
        return this.studentService.getStudentById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createStudent(@Body() createStudentDto:CreateStudentDto){
        return this.studentService.createStudent(createStudentDto);
    }

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    updateStudents(
        @Param('id') id: string,
        @Body() updateStudentDto: UpdateStudentDto
    ): Promise<Student>{
        return this.studentService.updateStudent(id, updateStudentDto);
    }

    @Delete('/:id')
    deleteStudent(@Param('id') id: string): Promise<void>{
        return this.studentService.deleteStudent(id);
    }
}