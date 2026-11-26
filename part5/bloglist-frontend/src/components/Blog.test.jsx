import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

const blog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Matti Luukkainen',
  url: 'https://example.com/testing',
  likes: 7,
  user: { id: 'u1', username: 'mluukkai', name: 'Matti Luukkainen' },
}

describe('<Blog />', () => {
  test('renders title and author but not url or likes by default', () => {
    const { container } = render(
      <Blog blog={blog} onLike={() => {}} onRemove={() => {}} canRemove={false} />
    )

    const summary = container.querySelector('.blog-summary')
    expect(summary).toHaveTextContent(blog.title)
    expect(summary).toHaveTextContent(blog.author)

    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(`likes ${blog.likes}`)).toBeNull()
  })

  test('shows url and likes after clicking the view button', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Blog blog={blog} onLike={() => {}} onRemove={() => {}} canRemove={false} />
    )

    await user.click(screen.getByText('view'))

    expect(container.querySelector('.blog-url')).toHaveTextContent(blog.url)
    expect(container.querySelector('.blog-likes')).toHaveTextContent('likes 7')
  })

  test('calls the like handler twice when like is clicked twice', async () => {
    const user = userEvent.setup()
    const onLike = vi.fn()
    render(<Blog blog={blog} onLike={onLike} onRemove={() => {}} canRemove={false} />)

    await user.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(onLike.mock.calls).toHaveLength(2)
  })
})
