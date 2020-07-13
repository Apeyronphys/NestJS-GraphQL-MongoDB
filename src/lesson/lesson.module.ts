import { Module } from '@nestjs/common';
import { LessonResolver } from './lesson.resolver';
import { LessonService } from './lesson.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Student } from 'src/student/student.entity';
import { StudentModule } from 'src/student/student.module';
import { forwardRef } from '@nestjs/common'; 
import { StudentService } from 'src/student/student.service';
import { LessonController } from './lesson.controller';

@Module({
    imports:[
        TypeOrmModule.forFeature([Lesson]),
        forwardRef(() => StudentModule),
    ],
    controllers: [LessonController],
    providers: [
        LessonResolver,
        LessonService,
        StudentService,
    ],
    exports: [
        LessonService,
        TypeOrmModule.forFeature([Lesson]), 
    ]
})
export class LessonModule {}
