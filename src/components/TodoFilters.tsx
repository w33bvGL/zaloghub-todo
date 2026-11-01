import type { Filter } from '../model/types'
import styles from './TodoFilters.module.css'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

interface Props {
  value: Filter
  onChange: (filter: Filter) => void
}

export function TodoFilters({ value, onChange }: Props) {
  return (
    <div className={styles.filters} role="group" aria-label="Filter tasks">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={styles.filter}
          aria-pressed={filter.value === value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
