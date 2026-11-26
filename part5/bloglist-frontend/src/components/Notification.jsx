import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <Alert
      severity={notification.type === 'error' ? 'error' : 'success'}
      className={`notification ${notification.type}`}
      sx={{ mb: 2 }}
    >
      {notification.text}
    </Alert>
  )
}

export default Notification
