import { useEffect, useRef, useState } from 'react'
import { Container } from '@mui/material'
import { Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'

import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import NavBar from './components/NavBar'
import NotFound from './components/NotFound'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })
  const [notification, setNotification] = useState(null)
  const timeoutRef = useRef()
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    blogService.setToken(user?.token)
  }, [user])

  const notify = (text, type = 'success') => {
    clearTimeout(timeoutRef.current)
    setNotification({ text, type })
    timeoutRef.current = setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async credentials => {
    try {
      const loggedUser = await loginService.login(credentials)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      notify(`welcome ${loggedUser.name}`)
      navigate('/')
      return true
    } catch {
      notify('wrong username or password', 'error')
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const createBlog = async newBlog => {
    try {
      const created = await blogService.create(newBlog)
      setBlogs(blogs.concat({ ...created, user: { username: user.username, name: user.name } }))
      notify(`a new blog ${created.title} by ${created.author} added`)
      navigate('/')
    } catch (error) {
      notify(error.response?.data?.error ?? 'could not add the blog', 'error')
    }
  }

  const likeBlog = async blog => {
    try {
      const updated = await blogService.update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user?.id,
      })
      setBlogs(blogs.map(b => (b.id === blog.id ? updated : b)))
      notify(`you liked ${blog.title}`)
    } catch {
      notify(`could not like ${blog.title}`, 'error')
    }
  }

  const removeBlog = async blog => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return
    }
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      notify(`removed ${blog.title}`)
      navigate('/')
    } catch (error) {
      notify(error.response?.data?.error ?? `could not remove ${blog.title}`, 'error')
    }
  }

  const blog = match ? blogs.find(b => b.id === match.params.id) : null

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      <Container sx={{ py: 3 }}>
        <Notification notification={notification} />
        <Routes>
          <Route path="/" element={<BlogList blogs={blogs} />} />
          <Route
            path="/blogs/:id"
            element={
              <BlogView blog={blog} user={user} onLike={likeBlog} onRemove={removeBlog} />
            }
          />
          <Route
            path="/create"
            element={user ? <BlogForm createBlog={createBlog} /> : <Navigate replace to="/login" />}
          />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
