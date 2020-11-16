/* eslint-disable new-cap */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Problem from './Problem'
import User from './User'

@Entity('answers')
class Answer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  userId!: number

  @Column()
  proplemId!: number

  @Column()
  correctAnswer!: string

  @ManyToOne(() => User, user => user.correctAnswers)
  user!: User

  @ManyToOne(() => Problem, problem => problem.correctAnswers)
  problem!: Problem
}

export default Answer
