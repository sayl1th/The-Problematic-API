/* eslint-disable new-cap */
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Problem from './Problem'
import User from './User'

@Entity('answers')
class Answer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  problemId!: number

  @Column()
  value!: string

  @ManyToOne(() => User, user => user.correctAnswers, { onDelete: 'CASCADE' })
  user!: User

  @OneToOne(() => Problem, problem => problem.acceptedAnswer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  problem!: Problem
}

export default Answer
