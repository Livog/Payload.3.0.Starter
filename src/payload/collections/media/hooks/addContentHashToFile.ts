import { CollectionBeforeOperationHook } from 'payload/types'

const hashBuffer = async (buffer: Buffer): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const addContentHashToFile: CollectionBeforeOperationHook = async ({ req, operation, args, context }) => {
  if (!['create', 'update'].includes(operation) || !req.file || !req.file.data || !(req.file.data instanceof Buffer) || context?.triggerAfterChange === false)
    return

  const hash = await hashBuffer(req.file.data)
  const fileNameParts = req.file.name.split('.')

  const extension = fileNameParts.length > 1 ? fileNameParts.pop() : ''
  const nameWithoutExtension = fileNameParts.join('.')

  req.file.name = `${nameWithoutExtension}-${hash}${extension ? `.${extension}` : ''}`
  args.data.title = `${nameWithoutExtension}${extension ? `.${extension}` : ''}`
  context.filenameHasContentHash = true
}
