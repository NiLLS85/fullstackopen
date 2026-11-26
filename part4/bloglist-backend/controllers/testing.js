const testingRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

// Solo se monta con NODE_ENV=test: vacía la base de datos para las pruebas E2E.
testingRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
