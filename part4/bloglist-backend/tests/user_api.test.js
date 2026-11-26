const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await helper.createUser('root', 'sekret', 'Superuser')
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.passwordHash, undefined)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    assert(usersAtEnd.map(user => user.username).includes(newUser.username))
  })

  test('users are listed without password hashes', async () => {
    const response = await api.get('/api/users').expect(200)
    assert.strictEqual(response.body.length, 1)
    assert.strictEqual(response.body[0].passwordHash, undefined)
    assert.deepStrictEqual(response.body[0].blogs, [])
  })

  test('creation fails with 400 if username is taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send({ username: 'root', name: 'Another', password: 'salainen' })
      .expect(400)

    assert(response.body.error.includes('expected `username` to be unique'))
    assert.strictEqual((await helper.usersInDb()).length, usersAtStart.length)
  })

  test('creation fails with 400 if username is shorter than 3 characters', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'ab', password: 'salainen' })
      .expect(400)

    assert(response.body.error.includes('username'))
    assert.strictEqual((await helper.usersInDb()).length, 1)
  })

  test('creation fails with 400 if username is missing', async () => {
    await api.post('/api/users').send({ password: 'salainen' }).expect(400)
    assert.strictEqual((await helper.usersInDb()).length, 1)
  })

  test('creation fails with 400 if password is shorter than 3 characters', async () => {
    const response = await api
      .post('/api/users')
      .send({ username: 'newuser', password: 'pw' })
      .expect(400)

    assert(response.body.error.includes('password'))
    assert.strictEqual((await helper.usersInDb()).length, 1)
  })

  test('creation fails with 400 if password is missing', async () => {
    await api.post('/api/users').send({ username: 'newuser' }).expect(400)
    assert.strictEqual((await helper.usersInDb()).length, 1)
  })
})

describe('login', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await helper.createUser('root', 'sekret', 'Superuser')
  })

  test('returns a token with the right password', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

    assert.ok(response.body.token)
    assert.strictEqual(response.body.username, 'root')
  })

  test('fails with 401 with a wrong password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'root', password: 'wrong' })
      .expect(401)
  })
})

after(async () => {
  await mongoose.connection.close()
})
