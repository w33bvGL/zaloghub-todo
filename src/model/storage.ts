import type { Todo } from './types'

export const STORAGE_KEY = 'zaloghub:todos'

function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false
  const todo = value as Record<string, unknown>
  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'number'
  )
}

export function parseTodos(raw: string | null): Todo[] {
  if (!raw) return []
  try {
    const data: unknown = JSON.parse(raw)
    return Array.isArray(data) ? data.filter(isTodo) : []
  } catch {
    return []
  }
}

export function loadTodos(): Todo[] {
  try {
    return parseTodos(localStorage.getItem(STORAGE_KEY))
  } catch {
    return []
  }
}

export function saveTodos(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (error) {
    console.warn('Failed to persist todos', error)
  }
}
