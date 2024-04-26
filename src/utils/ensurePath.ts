const ensurePath = (path: string) => `/${path}/`.replace(/\/+/g, '/')

export default ensurePath
