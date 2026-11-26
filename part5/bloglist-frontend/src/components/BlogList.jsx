import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

const byLikes = (a, b) => b.likes - a.likes

const BlogList = ({ blogs }) => (
  <div>
    <Typography variant="h4" component="h2" gutterBottom>
      blogs
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {blogs.toSorted(byLikes).map(blog => (
            <TableRow key={blog.id} className="blog">
              <TableCell>
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </TableCell>
              <TableCell>{blog.author}</TableCell>
              <TableCell align="right">{blog.likes} likes</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

export default BlogList
