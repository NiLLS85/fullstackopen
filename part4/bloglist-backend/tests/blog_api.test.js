const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let root
let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  root = await helper.createUser('root')
  token = helper.tokenFor(root)

  const blogs = await Blog.insertMany(
    helper.initialBlogs.map(blog => ({ ...blog, user: root._id }))
  )
  root.blogs = blogs.map(blog => blog._id)
  await root.save()
})

describe('when there are some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('the unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  test('blogs include the user who created them', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body[0].user.username, 'root')
    assert.strictEqual(response.body[0].user.passwordHash, undefined)
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const [blogToView] = await helper.blogsInDb()
    const response = await api.get(`/api/blogs/${blogToView.id}`).expect(200)
    assert.strictEqual(response.body.title, blogToView.title)
  })

  test('fails with 404 if the blog does not exist', async () => {
    const id = await helper.nonExistingId()
    await api.get(`/api/blogs/${id}`).expect(404)
  })

  test('fails with 400 if the id is invalid', async () => {
    await api.get('/api/blogs/5a3d5da59070081a82a3445').expect(400)
  })
})

describe('addition of a new blog', () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  }

  test('succeeds with a valid token and data', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert(blogsAtEnd.map(blog => blog.title).includes(newBlog.title))

    const saved = blogsAtEnd.find(blog => blog.title === newBlog.title)
    assert.strictEqual(saved.user.toString(), root._id.toString())

    const user = await User.findById(root._id)
    assert.strictEqual(user.blogs.length, helper.initialBlogs.length + 1)
  })

  test('sets likes to 0 if missing', async () => {
    const { title, author, url } = newBlog
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title, author, url })
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with 400 if title is missing', async () => {
    const { author, url, likes } = newBlog
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ author, url, likes })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with 400 if url is missing', async () => {
    const { title, author, likes } = newBlog
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title, author, likes })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with 401 if the token is missing', async () => {
    const response = await api.post('/api/blogs').send(newBlog).expect(401)
    assert(response.body.error.includes('token'))

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with 401 if the token is invalid', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer not-a-real-token')
      .send(newBlog)
      .expect(401)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with 204 when done by its creator', async () => {
    const [blogToDelete] = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    assert(!blogsAtEnd.map(blog => blog.id).includes(blogToDelete.id))
  })

  test('fails with 403 when done by another user', async () => {
    const other = await helper.createUser('mluukkai')
    const [blogToDelete] = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${helper.tokenFor(other)}`)
      .expect(403)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('fails with 401 without a token', async () => {
    const [blogToDelete] = await helper.blogsInDb()
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)
  })
})

describe('updating a blog', () => {
  test('changes the number of likes', async () => {
    const [blogToUpdate] = await helper.blogsInDb()

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ ...blogToUpdate, likes: blogToUpdate.likes + 1 })
      .expect(200)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

    const updated = (await helper.blogsInDb()).find(
      blog => blog.id === blogToUpdate.id
    )
    assert.strictEqual(updated.likes, blogToUpdate.likes + 1)
  })

  test('fails with 404 if the blog does not exist', async () => {
    const id = await helper.nonExistingId()
    await api.put(`/api/blogs/${id}`).send({ likes: 1 }).expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})
