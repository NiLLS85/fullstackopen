import axios from 'axios'

const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = newToken ? `Bearer ${newToken}` : null
}

const authConfig = () => ({ headers: { Authorization: token } })

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async newBlog => {
  const response = await axios.post(baseUrl, newBlog, authConfig())
  return response.data
}

const update = async (id, changedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, changedBlog)
  return response.data
}

const remove = async id => {
  await axios.delete(`${baseUrl}/${id}`, authConfig())
}

export default { setToken, getAll, create, update, remove }
