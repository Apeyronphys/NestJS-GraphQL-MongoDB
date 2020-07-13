import { Controller, Get, Param, Post, UsePipes, ValidationPipe, Body, Patch, Delete } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { Lesson } from "./lesson.entity";
import { CreateLessonDto } from "./dto/create.lesson.dto";
import { UpdateLessonDto } from "./dto/update.lesson.dto";

@Controller('lesson')
export class LessonController{ 
    constructor(
        private lessonService: LessonService, 
    ){}

    @Get()
    getLessons(): Promise<Lesson[]>{
        return this.lessonService.getLessons();
    }

    @Get('/:id')
        getLesson(@Param('id') id: string): Promise<Lesson>{
        return this.lessonService.getLesson(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createLesson(@Body() createLessonDto: CreateLessonDto): Promise<Lesson>{
        return this.lessonService.createLesson(createLessonDto);
    }

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    updateLesson(
        @Param('id') id: string,
        @Body() updateLessonDto: UpdateLessonDto,
    ): Promise<Lesson>{
        return this.lessonService.updateLesson(id, updateLessonDto);
    }

    @Delete('/:id')
    deleteLesson(@Param('id') id: string): Promise<void>{
        return this.lessonService.deleteLesson(id);
    }

}