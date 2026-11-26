const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((best, blog) => (blog.likes > best.likes ? blog : best))
}

// Devuelve la entrada con el valor más alto de un objeto { autor: valor }.
const topEntry = (totals, field) => {
  const authors = Object.keys(totals)
  if (authors.length === 0) {
    return null
  }
  const author = authors.reduce((best, current) =>
    totals[current] > totals[best] ? current : best
  )
  return { author, [field]: totals[author] }
}

const mostBlogs = blogs => {
  const counts = {}
  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })
  return topEntry(counts, 'blogs')
}

const mostLikes = blogs => {
  const likes = {}
  blogs.forEach(blog => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
  })
  return topEntry(likes, 'likes')
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
