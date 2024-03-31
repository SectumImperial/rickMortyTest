export function parseJSON<T>(value: string | null, defaultValue: T): T {
  try {
    return value ? (JSON.parse(value) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}
