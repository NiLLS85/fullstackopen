const { test, expect, beforeEach, describe } = require('@playwright/test')

const { loginWith, createBlog, blogByTitle } = require('./helper')

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

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const error = page.locator('.notification.error')
      await expect(error).toContainText('wrong username or password')
      await expect(error).toHaveCSS('color', 'rgb(179, 38, 30)')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
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
      await expect(blogByTitle(page, blog.title)).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, blog)
      const item = blogByTitle(page, blog.title)

      await item.getByRole('button', { name: 'view' }).click()
      await expect(item.getByText('likes 0')).toBeVisible()

      await item.getByRole('button', { name: 'like' }).click()
      await expect(item.getByText('likes 1')).toBeVisible()
    })

    test('the creator can delete the blog', async ({ page }) => {
      await createBlog(page, blog)
      const item = blogByTitle(page, blog.title)

      await item.getByRole('button', { name: 'view' }).click()
      page.once('dialog', dialog => dialog.accept())
      await item.getByRole('button', { name: 'remove' }).click()

      await expect(blogByTitle(page, blog.title)).toHaveCount(0)
    })

    test('only the creator sees the remove button', async ({ page }) => {
      await createBlog(page, blog)
      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'ada', 'analytical')
      await expect(page.getByText('Ada Lovelace logged in')).toBeVisible()

      const item = blogByTitle(page, blog.title)
      await item.getByRole('button', { name: 'view' }).click()
      await expect(item.getByText('likes 0')).toBeVisible()
      await expect(item.getByRole('button', { name: 'remove' })).toHaveCount(0)
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
        const item = blogByTitle(page, title)
        if (await item.getByRole('button', { name: 'view' }).isVisible()) {
          await item.getByRole('button', { name: 'view' }).click()
        }
        for (let i = 1; i <= times; i++) {
          await item.getByRole('button', { name: 'like' }).click()
          await expect(item.getByText(`likes ${i}`)).toBeVisible()
        }
      }

      await likeTimes('Second blog', 3)
      await likeTimes('Third blog', 2)
      await likeTimes('First blog', 1)

      await expect(page.locator('.blog-summary')).toHaveText([
        /Second blog/,
        /Third blog/,
        /First blog/,
      ])
    })
  })
})
