import { HttpContext } from '../../app/controllers/utils/httpContext'
import * as problemService from '../../app/services/problemService'
import { mocked } from 'ts-jest/utils'
import { getRepository } from 'typeorm'
import config from '../../config'

const mockedEntity = ({} as const) as jest.Mock

const mockedRepo = mocked(getRepository(mockedEntity))

beforeEach(() => {
  mockedRepo.save.mockClear()
  mockedRepo.find.mockClear()
  mockedRepo.findOne.mockClear()
  mockedRepo.remove.mockClear()
  mockedRepo.create.mockClear()
})

const initContext = () => {
  return {
    payload: {},
    params: {},
    user: { id: '1' },
    limit: 10,
    offset: 0,
  }
}
const testProblemObj = { type: 'riddle', description: 'test riddle' }

describe('problemService', () => {
  test('create', async () => {
    const context = initContext()

    context.payload = { ...testProblemObj }

    const testProblem = { id: 1, userId: context.user?.id, ...testProblemObj }

    mockedRepo.create.mockReturnValue(testProblemObj)
    mockedRepo.save.mockResolvedValue(testProblem)

    const data = await problemService.create(context as HttpContext)

    expect(data).toEqual({ data: testProblem })
  })

  test('get', async () => {
    const context = initContext()
    context.params = { id: 1 }

    const testProblem = { id: 1, userId: context.user?.id, ...testProblemObj }

    mockedRepo.findOne.mockResolvedValueOnce(testProblem)

    const data = await problemService.get(context as HttpContext)

    expect(data).toEqual({ data: testProblem })
  })

  test('update', async () => {
    const context = initContext()
    context.payload = { ...testProblemObj }
    context.params = { id: 1 }

    const testProblem = { id: 1, userId: context.user?.id, ...testProblemObj }

    mockedRepo.findOne.mockResolvedValue(testProblem)

    const updatedProblem = { ...testProblem, description: 'test' }

    mockedRepo.save.mockResolvedValue(updatedProblem)

    const data = await problemService.update(context as HttpContext)

    expect(data).toEqual({ data: updatedProblem })
  })

  test('remove', async () => {
    const context = initContext()
    context.params = { id: 1 }

    const testProblem = { id: 1, userId: context.user?.id, ...testProblemObj }

    mockedRepo.findOne.mockResolvedValue(testProblem)
    mockedRepo.remove.mockResolvedValue(testProblem)

    const data = await problemService.remove(context as HttpContext)

    expect(data).toEqual({ data: testProblem })
  })

  test('getAll', async () => {
    const context = initContext()
    context.params = { id: '1', isAnswered: 'true' }

    const testProblem = { id: 1, userId: context.user?.id, ...testProblemObj }

    mockedRepo.find.mockResolvedValueOnce([{ problemId: 1 }])
    mockedRepo.findAndCount.mockResolvedValueOnce([[testProblem], 1])

    const data = await problemService.getAll(context as HttpContext)

    expect(data).toEqual({ data: [testProblem], totalItems: 1, totalPages: 1 })
  })

  test('answerToProblem', async () => {
    const answerObj = { answer: config.staticAnswer }
    const answer = {
      ...answerObj,
      userId: 1,
      id: 1,
    }

    const context = initContext()
    context.payload = answerObj
    context.params = { id: 1 }

    const testProblem = { id: 1, userId: 1, ...testProblemObj }

    mockedRepo.findOne.mockResolvedValue({
      ...testProblem,
      acceptedAnswers: [],
    })
    mockedRepo.create.mockReturnValue(answer)
    mockedRepo.save.mockResolvedValue({
      ...testProblem,
      acceptedAnswers: [answer],
    })

    const data = await problemService.answerToProblem(context as HttpContext)

    expect(data).toEqual({ data: answer })
  })
})
