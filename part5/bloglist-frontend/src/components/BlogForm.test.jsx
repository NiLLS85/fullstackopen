import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog with the right details', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title:'), 'Testing the form')
  await user.type(screen.getByLabelText('author:'), 'Ada Lovelace')
  await user.type(screen.getByLabelText('url:'), 'https://example.com/form')
  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing the form',
    author: 'Ada Lovelace',
    url: 'https://example.com/form',
  })
})
