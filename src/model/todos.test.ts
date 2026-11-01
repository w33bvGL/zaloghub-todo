import { describe, expect, it, vi } from 'vitest'
import { createTodo, filterTodos, todosReducer } from './todos'
import type { Todo } from './types'

const todo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  title: 'Buy milk',
  completed: false,
  createdAt: 0,
  ...overrides,
})

describe('createTodo', () => {
  it('normalizes whitespace in the title', () => {
    expect(createTodo('  Walk   the dog ')).toMatchObject({
      title: 'Walk the dog',
      completed: false,
    })
  })

  it.each(['', '   ', '\n\t'])('rejects blank title %j', (title) => {
    expect(createTodo(title)).toBeNull()
  })

  it('works without crypto.randomUUID on insecure origins', () => {
    vi.stubGlobal('crypto', {})
    const a = createTodo('a')
    const b = createTodo('b')

    expect(a?.id).toBeTruthy()
    expect(a?.id).not.toBe(b?.id)
  })
})

describe('todosReducer', () => {
  it('adds a todo to the top', () => {
    const existing = todo()
    const added = todo()
    expect(todosReducer([existing], { type: 'add', todo: added })).toEqual([added, existing])
  })

  it('toggles only the matching todo', () => {
    const a = todo()
    const b = todo()
    const next = todosReducer([a, b], { type: 'toggle', id: a.id })

    expect(next[0].completed).toBe(true)
    expect(next[1]).toBe(b)
  })

  it('removes a todo', () => {
    const a = todo()
    const b = todo()
    expect(todosReducer([a, b], { type: 'remove', id: a.id })).toEqual([b])
  })

  it('clears completed todos', () => {
    const active = todo()
    expect(todosReducer([active, todo({ completed: true })], { type: 'clearCompleted' })).toEqual([
      active,
    ])
  })
})

describe('filterTodos', () => {
  const active = todo()
  const done = todo({ completed: true })
  const all = [active, done]

  it.each([
    ['all', all],
    ['active', [active]],
    ['completed', [done]],
  ] as const)('%s', (filter, expected) => {
    expect(filterTodos(all, filter)).toEqual(expected)
  })
})
