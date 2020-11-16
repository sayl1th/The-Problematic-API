/* eslint-disable new-cap */
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import Answer from './Answer'
import User from './User'

@Entity('problems')
class Problem {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  type!: string

  @Column()
  description!: string

  @ManyToOne(() => User, user => user.problems)
  user!: User

  @OneToMany(() => Answer, answers => answers.problem)
  correctAnswers!: Answer[]
}

export default Problem
