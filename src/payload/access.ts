import { Access } from 'payload/types'

export const isAdmin: Access = ({ req }) => {
  return req?.user?.role === 'admin'
}

export const isAdminOrCurrentUser: Access = ({ req }) => {
  if (req?.user?.role === 'admin') return true
  return { user: { equals: req.user?.id } }
}
