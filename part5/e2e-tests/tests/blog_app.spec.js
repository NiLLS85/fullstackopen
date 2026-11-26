const { test, expect, beforeEach, describe } = require('@playwright/test')

const { loginWith, createBlog, openBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' },
    })
    await request.post('http://localhost:3003/api/users', {
      data: { name: 'Ada Lovelace', username: 'ada', password: 'analytical' },
    })

    await page.goto('/')
  })

  test('front page shows the blog list and a login link', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'login' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'new blog' })).toHaveCount(0)
  })

  test('login form is shown at /login', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  test('unknown routes show page not found', async ({ page }) => {
    await page.goto('/does/not/exist')
    await expect(page.getByText('page not found')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page).toHaveURL(/\/$/)
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      await expect(page.locator('.notification.error')).toContainText(
        'wrong username or password'
      )
      await expect(page.getByText('Matti Luukkainen logged in')).toHaveCount(0)
      await expect(page).toHaveURL(/\/login$/)
    })
  })

  describe('When logged in', () => {
    const blog = {
      title: 'End to end testing with Playwright',
      author: 'Playwright Team',
      url: 'https://playwright.dev/',
    }

    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, blog)

      await expect(page.locator('.notification.success')).toContainText(
        `a new blog ${blog.title} by ${blog.author} added`
      )
      await expect(page.locator('.blog').filter({ hasText: blog.title })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, blog)
      await openBlog(page, blog.title)

      await expect(page.getByText('0 likes')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
      await expect(page.getByText('added by Matti Luukkainen')).toBeVisible()
    })

    test('the creator can delete the blog', async ({ page }) => {
      await createBlog(page, blog)
      await openBlog(page, blog.title)

      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.locator('.notification.success')).toContainText(
        `removed ${blog.title}`
      )
      await expect(page.getByRole('link', { name: blog.title })).toHaveCount(0)
    })

    test('only the creator sees the remove button', async ({ page }) => {
      await createBlog(page, blog)
      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'ada', 'analytical')
      await expect(page.getByText('Ada Lovelace logged in')).toBeVisible()

      await openBlog(page, blog.title)
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      const blogs = [
        { title: 'First blog', author: 'A', url: 'https://example.com/1' },
        { title: 'Second blog', author: 'B', url: 'https://example.com/2' },
        { title: 'Third blog', author: 'C', url: 'https://example.com/3' },
      ]
      for (const b of blogs) {
        await createBlog(page, b)
      }

      const likeTimes = async (title, times) => {
        await openBlog(page, title)
        for (let i = 1; i <= times; i++) {
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText(`${i} likes`)).toBeVisible()
        }
      }

      await likeTimes('Second blog', 3)
      await likeTimes('Third blog', 2)
      await likeTimes('First blog', 1)

      await page.getByRole('link', { name: 'blogs', exact: true }).click()
      await expect(page.locator('.blog')).toHaveText([
        /Second blog/,
        /Third blog/,
        /First blog/,
      ])
    })
  })
})
