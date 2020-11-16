/* eslint-disable new-cap */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Answer from './Answer'
import Problem from './Problem'

@Entity('users')
class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  username!: string

  @OneToMany(() => Problem, problems => problems.user)
  problems!: Problem[]

  @OneToMany(() => Answer, answers => answers.user)
  correctAnswers!: Answer[]
}

export default User
