const normalizePath = (path?: string | string[], keepTrailingSlash: boolean = false): string => {
  if (!path) return '/'
  if (Array.isArray(path)) path = path.join('/')
  path = `/${path}/`.replace(/\/+/g, '/')
  path = path !== '/' && !keepTrailingSlash ? path.replace(/\/$/, '') : path
  return path
}

export default normalizePath
