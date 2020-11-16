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

  @Column()
  correctAnswer!: string

  @ManyToOne(() => User, user => user.problems, { onDelete: 'CASCADE' })
  user!: User

  @OneToMany(() => Answer, answers => answers.problem, { cascade: true })
  correctAnswers!: Answer[]
}

export default Problem
