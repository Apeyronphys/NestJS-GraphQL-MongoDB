import { Entity, ObjectIdColumn, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Student{
    @ObjectIdColumn()
    _id: string;

    @PrimaryColumn()
    id: string;

    @Column()
    firstName: string; 

    @Column()
    lastName: string;

    @Column()
    lessons: string[];
    
    @Column()
    friends: string[];
}