import type { Filter, Todo } from './types'

export type TodoAction =
  | { type: 'add'; todo: Todo }
  | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'clearCompleted' }
  | { type: 'replace'; todos: Todo[] }

export function normalizeTitle(title: string) {
  return title.trim().replace(/\s+/g, ' ')
}

function createId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function createTodo(title: string): Todo | null {
  const normalized = normalizeTitle(title)
  if (!normalized) return null
  return { id: createId(), title: normalized, completed: false, createdAt: Date.now() }
}

export function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'add':
      return [action.todo, ...state]
    case 'toggle':
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
      )
    case 'remove':
      return state.filter((todo) => todo.id !== action.id)
    case 'clearCompleted':
      return state.filter((todo) => !todo.completed)
    case 'replace':
      return action.todos
  }
}

export function filterTodos(todos: Todo[], filter: Filter) {
  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed)
    case 'completed':
      return todos.filter((todo) => todo.completed)
    case 'all':
      return todos
  }
}
