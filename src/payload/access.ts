import { Access } from 'payload/types'

export const isAdmin: Access = ({ req }) => {
  return req?.user?.role === 'admin'
}

export const isAdminOrCurrentUser: Access = ({ req }) => {
  if (req?.user?.role === 'admin') return true
  return { id: { equals: req.user?.id } }
}

export const isAnyone: Access = () => true

export const isAdminOrPublished: Access = ({ req: { user } }) => {
  if (user && user?.role === 'admin') {
    return true
  }

  return {
    _status: {
      equals: 'published'
    }
  }
}

export const isAdminOrStripeActive: Access = ({ req: { user } }) => {
  if (user && user?.role === 'admin') {
    return true
  }

  return {
    active: {
      equals: true
    }
  }
}

export const isAdminOrUserFieldMatchingCurrentUser: Access = ({ req: { user } }) => {
  if (user) {
    if (user?.role === 'admin') return true
    return {
      user: {
        equals: user?.id
      }
    }
  }
  return false
}

export const loggedInOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published'
    }
  }
}
