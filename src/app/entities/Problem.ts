/* eslint-disable new-cap */
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
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

  @Column()
  correctAnswer!: string

  @ManyToOne(() => User, user => user.problems, { onDelete: 'CASCADE' })
  user!: User

  @OneToOne(() => Answer, answers => answers.problem, { cascade: true })
  acceptedAnswer!: Answer
}

export default Problem
