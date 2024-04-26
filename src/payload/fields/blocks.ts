import type { Field } from 'payload/types'
import blocks from '@/payload/blocks'
import deepMerge from 'deepmerge'

type BlocksField = (overrides?: Partial<Field>) => Field

export const blocksField: BlocksField = (overrides) => {
  return deepMerge<Field, Partial<Field>>(
    {
      name: 'blocks',
      type: 'blocks',
      blocks
    },
    overrides || {}
  )
}
