export const PrimaryGeneratedColumn = jest.fn()
export const Column = jest.fn()
export const Entity = jest.fn()
export const OneToMany = jest.fn()
export const ManyToOne = jest.fn()
export const In = jest.fn()
export const Not = jest.fn()

export const getRepository = jest.fn().mockReturnValue({
  // return values will be set in the test
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  find: jest.fn(),
  findAndCount: jest.fn(),
})
