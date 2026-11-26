import { Button, Card, CardActions, CardContent, Link, Typography } from '@mui/material'

const BlogView = ({ blog, user, onLike, onRemove }) => {
  if (!blog) {
    return <Typography>blog not found</Typography>
  }

  const isCreator = user && blog.user && blog.user.username === user.username

  return (
    <Card sx={{ maxWidth: 700 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {blog.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {blog.author}
        </Typography>
        <Typography>
          <Link href={blog.url}>{blog.url}</Link>
        </Typography>
        <Typography className="blog-likes" sx={{ mt: 1 }}>
          {blog.likes} likes
        </Typography>
        <Typography variant="body2" color="text.secondary">
          added by {blog.user?.name}
        </Typography>
      </CardContent>
      {user && (
        <CardActions>
          <Button variant="contained" onClick={() => onLike(blog)}>
            like
          </Button>
          {isCreator && (
            <Button color="error" variant="outlined" onClick={() => onRemove(blog)}>
              remove
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  )
}

export default BlogView
