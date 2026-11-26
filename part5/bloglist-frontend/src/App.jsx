import { useEffect, useRef, useState } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'loggedBlogappUser'

const byLikes = (a, b) => b.likes - a.likes

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()
  const timeoutRef = useRef()

  useEffect(() => {
    blogService.getAll().then(initialBlogs => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const savedUser = JSON.parse(saved)
      setUser(savedUser)
      blogService.setToken(savedUser.token)
    }
  }, [])

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
  }

  const createBlog = async newBlog => {
    try {
      const created = await blogService.create(newBlog)
      // el backend devuelve el id del usuario; se completa con sus datos
      setBlogs(blogs.concat({ ...created, user: { username: user.username, name: user.name } }))
      blogFormRef.current.toggleVisibility()
      notify(`a new blog ${created.title} by ${created.author} added`)
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
    } catch (error) {
      notify(error.response?.data?.error ?? `could not remove ${blog.title}`, 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification notification={notification} />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {[...blogs].sort(byLikes).map(blog => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={likeBlog}
          onRemove={removeBlog}
          canRemove={blog.user?.username === user.username}
        />
      ))}
    </div>
  )
}

export default App
