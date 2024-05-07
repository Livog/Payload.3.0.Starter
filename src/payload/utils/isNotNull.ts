import _get from 'lodash/get'

function isNotNull<T>(value: T): value is NonNullable<T>
function isNotNull<T, K extends keyof T>(object: T, path: K | string): object is T & Record<K, NonNullable<T[K]>>
function isNotNull<T, K extends keyof T>(object: T, path?: K | string): boolean {
  if (path !== undefined) {
    const value = _get(object, path)
    return value !== null && value !== undefined
  }
  return object !== null && object !== undefined
}

export default isNotNull
