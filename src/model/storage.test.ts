import { describe, expect, it } from 'vitest'
import { parseTodos } from './storage'

describe('parseTodos', () => {
  const valid = { id: '1', title: 'Read a book', completed: true, createdAt: 1 }

  it('returns an empty list for missing or broken data', () => {
    expect(parseTodos(null)).toEqual([])
    expect(parseTodos('{not json')).toEqual([])
    expect(parseTodos('{"id":"1"}')).toEqual([])
  })

  it('drops malformed items', () => {
    const raw = JSON.stringify([valid, { id: 2, title: 'x' }, null, 'oops'])
    expect(parseTodos(raw)).toEqual([valid])
  })
})
