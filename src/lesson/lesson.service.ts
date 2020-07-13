import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid'; 
import { CreateLessonInput } from './lesson.input';
import { UpdateLessonInput } from './lesson.input.update';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
        @Inject(forwardRef(() => StudentService)) private studentService: StudentService,
    ){}

    async getLesson(id: string, throwError?: boolean): Promise<Lesson>{
        const lesson = await this.lessonRepository.findOne({ id });
        if (!lesson && throwError) {
            throw new NotFoundException(`Group with id: ${id} is not found`);
        }
        return lesson; 
    }

    async getLessons(): Promise<Lesson[]>{
        return this.lessonRepository.find();
    }

    async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson>{
        const { name, startDate, endDate, students } = createLessonInput; 
        const lesson = this.lessonRepository.create({
            id: uuid(),
            name, 
            startDate, 
            endDate,
            students,
        });

        const uniqExistingStudentIDs = await this.studentService.getUniqExitingStudentIDs(students);
        await this.studentService.addLessonToStudent(uniqExistingStudentIDs, lesson.id);
        lesson.students = uniqExistingStudentIDs;
 
        return this.lessonRepository.save(lesson);
    }

    async updateLesson(id: string, updateLesson: UpdateLessonInput): Promise<Lesson>{
        const { endDate, students } = updateLesson;
        const lesson = await this.getLesson(id);
        if (endDate){
        lesson.endDate = endDate;
        }
        
        if(!students || !students.length){
            return this.lessonRepository.save(lesson);
        }

        const uniqExistingStudentsIDs = await this.studentService.getUniqExitingStudentIDs(students);

        const studentsIDsToAdd = this.studentService.substractIdArrays(uniqExistingStudentsIDs, lesson.students);

        await this.studentService.addLessonToStudent(studentsIDsToAdd, lesson.id);

        const studentsIDsDelete = this.studentService.substractIdArrays(lesson.students, uniqExistingStudentsIDs);

        await this.studentService.deleteLessonFromStudent(studentsIDsDelete, lesson.id);
        lesson.students = uniqExistingStudentsIDs;

        return this.lessonRepository.save(lesson); 
    }

    async deleteLesson(id: string): Promise<void>{
        const lesson = await this.getLesson(id);
        await this.studentService.deleteLessonFromStudent(lesson.students, lesson.id);
        await this.lessonRepository.remove(lesson); 
        // this.lessonRepository.delete({ id });
        //return this.lessonRepository.find();
    }

    async addStudentToLesson(lessonIDs: string[], studentID: string): Promise<void>{
        const lessons = await this.getManyLessons(lessonIDs);
        const updateLessons = lessons.map(lesson => {
            lesson.students.push(studentID);
            return lesson; 
        });
        await this.lessonRepository.save(updateLessons)
    }

    async deleteStudentFromLesson(lessonIDs: string[], studentID: string): Promise<void>{
        const lessons = await this.getManyLessons(lessonIDs);
        const updateLessons = lessons.map(lesson => {
            lesson.students = lesson.students.filter(student => student !== studentID);
            return lesson;
        });
        await this.lessonRepository.save(updateLessons);
    }

    async getManyLessons(lessonsIDs: string[]): Promise<Lesson[]>{
        return this.lessonRepository.find({
            where:{
                id: {
                    $in: lessonsIDs,
                },
            },
        });
    }

    async getUniqExistingLessonsIDs(ids: string[]): Promise<string[]>{
        const uniqLessonIDs = this.studentService.getUniqIds(ids); 
        const existingLessonIDs = (await this.getManyLessons(ids)).map(group => group.id);
        if (uniqLessonIDs.length !== existingLessonIDs.length){
            const lessonsIDsNotFound = this.studentService.substractIdArrays(uniqLessonIDs, existingLessonIDs);
            throw new NotFoundException(`Invalid lessonIDs array, next lessons not founf ${lessonsIDsNotFound.toString()}`);
        }
        return existingLessonIDs; 
    }


    // async assignStudentsToLesson(
    //     lessonId: string,
    //     studentsIDs: string[]
    //     ):Promise<Lesson>{
    //         const lesson = await this.lessonRepository.findOne({ id: lessonId });
    //         lesson.students = [...lesson.students, ...studentsIDs];
    //         return this.lessonRepository.save(lesson);
    //     }
}
