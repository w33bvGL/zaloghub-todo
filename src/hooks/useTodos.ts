import { useEffect, useMemo, useReducer } from 'react'
import { loadTodos, parseTodos, saveTodos, STORAGE_KEY } from '../model/storage'
import { createTodo, filterTodos, todosReducer } from '../model/todos'
import type { Filter } from '../model/types'

export function useTodos(filter: Filter) {
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadTodos)

  useEffect(() => {
    saveTodos(todos)
  }, [todos])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return
      dispatch({ type: 'replace', todos: parseTodos(event.newValue) })
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const actions = useMemo(
    () => ({
      add: (title: string) => {
        const todo = createTodo(title)
        if (!todo) return false
        dispatch({ type: 'add', todo })
        return true
      },
      toggle: (id: string) => dispatch({ type: 'toggle', id }),
      remove: (id: string) => dispatch({ type: 'remove', id }),
      clearCompleted: () => dispatch({ type: 'clearCompleted' }),
    }),
    [],
  )

  const visible = useMemo(() => filterTodos(todos, filter), [todos, filter])
  const activeCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos])

  return {
    todos: visible,
    total: todos.length,
    activeCount,
    completedCount: todos.length - activeCount,
    ...actions,
  }
}
