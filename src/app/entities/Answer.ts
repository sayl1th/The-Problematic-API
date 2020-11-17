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
  problemId!: number

  @Column()
  value!: string

  @ManyToOne(() => User, user => user.correctAnswers, { onDelete: 'CASCADE' })
  user!: User

  @ManyToOne(() => Problem, problem => problem.acceptedAnswers, {
    onDelete: 'CASCADE',
  })
  problem!: Problem
}

export default Answer
