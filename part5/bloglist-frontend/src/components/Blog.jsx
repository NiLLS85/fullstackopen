import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove, canRemove }) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="blog">
      <div className="blog-summary">
        {blog.title} {blog.author}{' '}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div className="blog-details">
          <div className="blog-url">
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div className="blog-likes">
            likes {blog.likes} <button onClick={() => onLike(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {canRemove && (
            <button className="remove" onClick={() => onRemove(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
