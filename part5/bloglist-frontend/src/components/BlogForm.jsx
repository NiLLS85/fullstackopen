import { useState } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 500 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        create new
      </Typography>
      <Box component="form" onSubmit={addBlog}>
        <TextField
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          create
        </Button>
      </Box>
    </Paper>
  )
}

export default BlogForm
