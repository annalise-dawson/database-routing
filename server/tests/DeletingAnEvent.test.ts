import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import request from 'supertest'

import { connection } from '../db/index.ts'
import server from '../server.ts'

beforeAll(async () => {
  await connection.migrate.latest()
})

beforeEach(async () => {
  await connection.seed.run()
})

afterAll(async () => {
  await connection.destroy()
})

describe('Deleting an Event', () => {
  it('can be deleted', async () => {
    const res = await request(server).get('/api/v1/events/1')
    expect(res.status).toBe(200)

    const res2 = await request(server).delete('/api/v1/events/1')
    expect(res2.status).toBe(204)

    const res3 = await request(server).get('/api/v1/events/1')
    expect(res3.status).toBe(404)
  })
})
