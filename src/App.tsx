import { useState } from 'react'
import { TodoFilters } from './components/TodoFilters'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { useTodos } from './hooks/useTodos'
import type { Filter } from './model/types'
import styles from './App.module.css'

const EMPTY_TEXT: Record<Filter, string> = {
  all: 'No tasks yet. Write the first one above.',
  active: 'Nothing left to do.',
  completed: 'Nothing crossed off yet.',
}

export function App() {
  const [filter, setFilter] = useState<Filter>('all')
  const { todos, total, activeCount, completedCount, add, toggle, remove, clearCompleted } =
    useTodos(filter)

  return (
    <main className={styles.app}>
      <h1 className={styles.heading}>Tasks</h1>

      <TodoForm onAdd={add} />

      {total > 0 && (
        <div className={styles.toolbar}>
          <span className={styles.counter}>
            {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
          </span>
          <TodoFilters value={filter} onChange={setFilter} />
        </div>
      )}

      {todos.length > 0 ? (
        <ul role="list">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggle} onRemove={remove} />
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>{EMPTY_TEXT[filter]}</p>
      )}

      {completedCount > 0 && (
        <button type="button" className={styles.clear} onClick={clearCompleted}>
          Clear completed ({completedCount})
        </button>
      )}
    </main>
  )
}
