const STORAGE_PREFIX = 'fx-checker:'

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded')
    }
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key)
}
