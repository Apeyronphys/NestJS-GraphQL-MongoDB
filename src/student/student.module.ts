import { Module, forwardRef } from '@nestjs/common';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { StudentResolver } from './student.resolver';
import { LessonModule } from 'src/lesson/lesson.module';
import { LessonService } from 'src/lesson/lesson.service';
import { StudentController } from './student.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    forwardRef(() => LessonModule),
  ],
  controllers: [StudentController],
  providers: [
    StudentResolver,
    StudentService,
    LessonService,
  ],
  exports: [
    StudentService,
    TypeOrmModule.forFeature([Student]), 
  ],
})
export class StudentModule {}
