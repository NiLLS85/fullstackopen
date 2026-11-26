import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogView from './BlogView'

const creator = { username: 'mluukkai', name: 'Matti Luukkainen', token: 'x' }
const otherUser = { username: 'ada', name: 'Ada Lovelace', token: 'y' }

const blog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Kent C. Dodds',
  url: 'https://example.com/testing',
  likes: 7,
  user: { id: 'u1', username: 'mluukkai', name: 'Matti Luukkainen' },
}

const renderBlog = (user, handlers = {}) =>
  render(
    <BlogView
      blog={blog}
      user={user}
      onLike={handlers.onLike ?? (() => {})}
      onRemove={handlers.onRemove ?? (() => {})}
    />
  )

describe('<BlogView />', () => {
  test('shows the blog and its likes but no buttons to a visitor who is not logged in', () => {
    renderBlog(null)

    expect(screen.getByText(blog.title)).toBeInTheDocument()
    expect(screen.getByText(blog.author)).toBeInTheDocument()
    expect(screen.getByText(blog.url)).toBeInTheDocument()
    expect(screen.getByText('7 likes')).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  test('shows only the like button to a logged-in user who did not create the blog', () => {
    renderBlog(otherUser)

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('shows both like and remove buttons to the creator of the blog', () => {
    renderBlog(creator)

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
  })

  test('calls the like handler twice when like is clicked twice', async () => {
    const user = userEvent.setup()
    const onLike = vi.fn()
    renderBlog(otherUser, { onLike })

    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(onLike.mock.calls).toHaveLength(2)
  })
})
