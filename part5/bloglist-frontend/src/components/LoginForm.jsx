import { useState } from 'react'
import { Box, Button, Paper, TextField, Typography } from '@mui/material'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    const ok = await onLogin({ username, password })
    if (!ok) {
      setPassword('')
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 400 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        log in to application
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="username"
          value={username}
          autoComplete="username"
          onChange={({ target }) => setUsername(target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={({ target }) => setPassword(target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          login
        </Button>
      </Box>
    </Paper>
  )
}

export default LoginForm
