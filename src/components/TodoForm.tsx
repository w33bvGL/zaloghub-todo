import { useState, type FormEvent } from 'react'
import styles from './TodoForm.module.css'

interface Props {
  onAdd: (title: string) => boolean
}

export function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const isBlank = title.trim() === ''

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (onAdd(title)) setTitle('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Write a task"
        aria-label="New task"
        maxLength={200}
        autoFocus
      />
      <button className={styles.submit} type="submit" disabled={isBlank}>
        Add task
      </button>
    </form>
  )
}
