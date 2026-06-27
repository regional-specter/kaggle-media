import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStored((prev) => {
        const next = value instanceof Function ? value(prev) : value
        window.localStorage.setItem(key, JSON.stringify(next))
        return next
      })
    },
    [key],
  )

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStored(JSON.parse(event.newValue) as T)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [stored, setValue]
}
