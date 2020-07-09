import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid'; 
import { CreateLessonInput } from './lesson.input';

@Injectable()
export class LessonService {
    constructor(
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    ){}

    async getLesson(id: string): Promise<Lesson>{
        return this.lessonRepository.findOne({ id });
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

        return this.lessonRepository.save(lesson);
    }

    async updateLesson(id: string, endDate: string): Promise<Lesson>{
        const lesson = await this.getLesson(id);
        lesson.endDate = endDate; 
        return this.lessonRepository.save(lesson); 
    }

    async deleteLesson(id: string): Promise<Lesson[]>{
        this.lessonRepository.delete({ id });
        return this.lessonRepository.find();
    }

    async assignStudentsToLesson(
        lessonId: string,
        studentsIDs: string[]
        ):Promise<Lesson>{
            const lesson = await this.lessonRepository.findOne({ id: lessonId });
            lesson.students = [...lesson.students, ...studentsIDs];
            return this.lessonRepository.save(lesson);
        }
}
