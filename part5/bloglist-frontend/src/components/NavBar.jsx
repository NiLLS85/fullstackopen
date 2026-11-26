import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

const NavBar = ({ user, onLogout }) => (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" component={Link} to="/">
        blogs
      </Button>
      {user && (
        <Button color="inherit" component={Link} to="/create">
          new blog
        </Button>
      )}
      <Box sx={{ flexGrow: 1 }} />
      {user ? (
        <>
          <Typography sx={{ mr: 2 }}>{user.name} logged in</Typography>
          <Button color="inherit" variant="outlined" onClick={onLogout}>
            logout
          </Button>
        </>
      ) : (
        <Button color="inherit" component={Link} to="/login">
          login
        </Button>
      )}
    </Toolbar>
  </AppBar>
)

export default NavBar
