import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Repository } from 'typeorm';
import { CreateStudentInput } from './student.input';
import { v4 as uuid } from 'uuid';
import { LessonService } from 'src/lesson/lesson.service';
import { UpdateStudentInput } from './student.input.update';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student) private studentRepository: Repository<Student>,
        @Inject(forwardRef(() => LessonService)) private lessonService: LessonService,
    ){}

    async getStudentById(id: string): Promise<Student>{
        return this.studentRepository.findOne({ id });
    }

    async getStudents(): Promise<Student[]>{
        return this.studentRepository.find();
    }

    async createStudent(createStudentInput: CreateStudentInput): Promise<Student>{
        const { firstName, lastName, lessons, friends } = createStudentInput;

        const student = this.studentRepository.create({
            id: uuid(),
            firstName,
            lastName,
            lessons,
            friends,
        });

        if(lessons){
            const uniqExistingLessonIDs = await this.lessonService.getUniqExistingLessonsIDs(lessons);
            await this.lessonService.addStudentToLesson(uniqExistingLessonIDs, student.id);
            student.lessons = uniqExistingLessonIDs; 
        }

        if(friends){
            const uniqExistingFriendsIDs = await this.getUniqExitingStudentIDs(friends);
            await this.addStudentToFriend(uniqExistingFriendsIDs, student.id);
            student.friends = uniqExistingFriendsIDs; 
        }

        return this.studentRepository.save(student);
    }

    async updateStudent(id: string, updateStudentInput: UpdateStudentInput): Promise<Student>{
        const { firstName, lastName, lessons, friends } = updateStudentInput;
        const student = await this.getStudentById(id);

        if(firstName){
            student.firstName = firstName;
        }

        if(lastName){
            student.lastName = lastName; 
        }

        if(lessons){
            const uniqExistingLessonIDs = await this.lessonService.getUniqExistingLessonsIDs(lessons);

            const lessonsToAdd = this.substractIdArrays(uniqExistingLessonIDs, student.lessons);

            await this.lessonService.addStudentToLesson(lessonsToAdd, student.id);

            const lessonIDsDelete = this.substractIdArrays(student.lessons, uniqExistingLessonIDs);

            await this.lessonService.deleteStudentFromLesson(lessonIDsDelete, student.id);

            student.lessons = uniqExistingLessonIDs; 
        }

        if(friends){
            const uniqExistingFriendsIDs = await this.getUniqExitingStudentIDs(friends);
            const friendsToAdd = this.substractIdArrays(uniqExistingFriendsIDs, student.friends);
            await this.addStudentToFriend(friendsToAdd, student.id);
            const friendsIDsToDelete = this.substractIdArrays(student.friends, uniqExistingFriendsIDs);
            await this.deleteStudentFromFriends(friendsIDsToDelete, student.id);
            student.friends = uniqExistingFriendsIDs; 
        }

        return this.studentRepository.save(student);
    }

    async deleteStudent(id: string): Promise<void>{
        const student = await this.getStudentById(id);
        await this.lessonService.deleteStudentFromLesson( student.lessons, student.id);
        await this.studentRepository.remove(student);
    }


    async addLessonToStudent(studentIDs: string[], lessonID: string): Promise<void>{
        const student = await this.getManyStudents(studentIDs);
        const updatedStudents = student.map(student => {
            student.lessons.push(lessonID);
            return student; 
        });
        await this.studentRepository.save(updatedStudents);
    }

    async deleteLessonFromStudent(studentID: string[], lessonID: string): Promise<void>{
        const students = await this.getManyStudents(studentID); 
        const deleteStudents = students.map(student => {
            student.lessons = student.lessons.filter(lesson => lesson !== lessonID);
            return student; 
        });
        await this.studentRepository.save(deleteStudents); 
    }

    async addStudentToFriend(friendsIDs: string[], studentID: string): Promise<void>{
        const friends = await this.getManyStudents(friendsIDs);
        const updateFriends = friends.map(friend => {
            friend.friends.push(studentID);
            return friend; 
        });

        await this.studentRepository.save(updateFriends);
    }

    async deleteStudentFromFriends(friendsIDs: string[], studentID: string): Promise<void>{
        const friends = await this.getManyStudents(friendsIDs);
        const deleteFriends = friends.map(friend => {
            friend.friends = friend.friends.filter(friend => friend !== studentID);
            return friend; 
        });
        await this.studentRepository.save(deleteFriends); 
    }

    async getManyStudents(studentIDs: string[]): Promise<Student[]>{
        return this.studentRepository.find({
            where:{
                id:{
                    $in: studentIDs,
                }
            }
        });
    }

    getUniqIds(ids: string[]): string[]{
        return ids.filter((item, idx, arr) => arr.indexOf(item) === idx);
    }

    substractIdArrays(subtrahendArray: string[], substractorArray: string[]){
        return subtrahendArray.filter(id => substractorArray.indexOf(id) === -1);
    }

    async getUniqExitingStudentIDs(ids: string[]): Promise<string[]>{
        const uniqStudentIDs = this.getUniqIds(ids); 
        const existingStudentIDs = (await this.getManyStudents(ids)).map(student => student.id);
        
        if(uniqStudentIDs.length !== existingStudentIDs.length){
            const studentIsNotFounded = this.substractIdArrays(uniqStudentIDs, existingStudentIDs);
            throw new NotFoundException(`Invaild students array, next students are not found ${studentIsNotFounded.toString()}`);
        }
        return existingStudentIDs; 
    }

    // async assignLessonsToStudents(
    //     studentID: string,
    //     lessonsIDs: string[], 
    // ): Promise<Student>{
    //     const student = await this.studentRepository.findOne({ id: studentID });
    //     student.lessons = [...student.lessons, ...lessonsIDs];
    //     return this.studentRepository.save(student); 
    // }
}
