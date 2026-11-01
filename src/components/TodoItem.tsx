import { memo } from 'react'
import type { Todo } from '../model/types'
import styles from './TodoItem.module.css'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export const TodoItem = memo(function TodoItem({ todo, onToggle, onRemove }: Props) {
  return (
    <li className={styles.item}>
      <label className={styles.label}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className={styles.title}>{todo.title}</span>
      </label>
      <button
        type="button"
        className={styles.remove}
        onClick={() => onRemove(todo.id)}
        aria-label={`Delete "${todo.title}"`}
      >
        Delete
      </button>
    </li>
  )
})
