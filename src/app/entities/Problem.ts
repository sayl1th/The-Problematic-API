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
  userId!: number

  @Column()
  type!: string

  @Column()
  description!: string

  @ManyToOne(() => User, user => user.problems, { onDelete: 'CASCADE' })
  user!: User

  @OneToMany(() => Answer, answers => answers.problem, { cascade: true })
  acceptedAnswers!: Answer[]
}

export default Problem
