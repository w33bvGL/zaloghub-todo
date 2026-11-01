import { act, cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { STORAGE_KEY } from './model/storage'

const addTodo = async (user: ReturnType<typeof userEvent.setup>, title: string) => {
  await user.type(screen.getByRole('textbox', { name: 'New task' }), title)
  await user.click(screen.getByRole('button', { name: 'Add task' }))
}

describe('App', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('adds, completes and removes a todo', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTodo(user, 'Buy milk')
    const checkbox = screen.getByRole('checkbox', { name: 'Buy milk' })
    expect(screen.getByRole('textbox', { name: 'New task' })).toHaveProperty('value', '')

    await user.click(checkbox)
    expect(checkbox).toHaveProperty('checked', true)

    await user.click(screen.getByRole('button', { name: 'Delete "Buy milk"' }))
    expect(screen.queryByRole('listitem')).toBeNull()
  })

  it('does not add a blank todo', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('textbox', { name: 'New task' }), '   {Enter}')
    expect(screen.queryByRole('listitem')).toBeNull()
    expect(screen.getByRole('button', { name: 'Add task' })).toHaveProperty('disabled', true)
  })

  it('filters by status', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addTodo(user, 'Active one')
    await addTodo(user, 'Done one')
    await user.click(screen.getByRole('checkbox', { name: 'Done one' }))

    await user.click(screen.getByRole('button', { name: 'Active' }))
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      expect.stringContaining('Active one'),
    ])

    await user.click(screen.getByRole('button', { name: 'Completed' }))
    const list = screen.getByRole('list')
    expect(within(list).getByText('Done one')).toBeTruthy()
    expect(within(list).queryByText('Active one')).toBeNull()
  })

  it('restores todos after reload', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await addTodo(user, 'Persist me')
    unmount()

    render(<App />)
    expect(screen.getByRole('checkbox', { name: 'Persist me' })).toBeTruthy()
  })

  it('syncs changes from another tab', () => {
    render(<App />)
    const todos = [{ id: '1', title: 'From another tab', completed: false, createdAt: 0 }]

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', { key: STORAGE_KEY, newValue: JSON.stringify(todos) }),
      )
    })

    expect(screen.getByRole('checkbox', { name: 'From another tab' })).toBeTruthy()
  })
})
