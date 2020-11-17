/* eslint-disable sonarjs/no-duplicate-string */
import { omit } from 'lodash'
import { resolve } from 'path'
import * as request from 'supertest-as-promised'
import { createConnection, getConnection, getRepository } from 'typeorm'
import User from '../../app/entities/User'
import config from '../../config'
import app from '../../server'

jest.unmock('typeorm')

beforeAll(async () => {
  await createConnection({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    logging: false,
    entities: [resolve(__dirname, '../../app/entities/*.ts')],
  })
  const repo = getRepository(User)
  await repo.save({ username: 'test' })
})

afterAll(async () => {
  const connection = getConnection()
  await connection.close()
})

describe('Problem', () => {
  const input = {
    type: 'riddle',
    description: 'testriddle',
  }

  const data = { ...input, id: 1, userId: 1 }

  test('Problem endpoints', async () => {
    const req = request(app)

    // create
    let res = await req.post('/api/problems/').auth('test', ' ').send(input)
    let payload = res.body

    expect(res.status).toBe(201)
    expect(payload).toEqual({ data })

    // answer
    const answerInput = { answer: config.staticAnswer }
    res = await req
      .post('/api/problems/1/answer')
      .auth('test', ' ')
      .send(answerInput)
    payload = res.body

    expect(res.status).toBe(201)
    expect(payload).toEqual({
      data: { value: answerInput.answer, id: 1, userId: 1, problemId: 1 },
    })

    // getAll
    res = await req.get('/api/problems/').auth('test', ' ')
    payload = res.body

    expect(res.status).toBe(200)
    expect(payload).toEqual({ data: [data], totalItems: 1, totalPages: 1 })

    // get
    res = await req.get('/api/problems/1').auth('test', ' ')
    payload = res.body

    expect(res.status).toBe(200)
    expect(payload).toEqual({ data })

    // update

    const toUpdate = { type: 'riddle', description: 'testtest' }

    res = await req.put('/api/problems/1').auth('test', ' ').send(toUpdate)
    payload = res.body

    expect(res.status).toBe(200)
    expect(payload).toEqual({ data: { ...data, ...toUpdate } })

    // delete

    res = await req.delete('/api/problems/1').auth('test', ' ')
    payload = res.body

    expect(res.status).toBe(200)
    expect(payload).toEqual({ data: omit({ ...data, ...toUpdate }, 'id') })
  })
})
