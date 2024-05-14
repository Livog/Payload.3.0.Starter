import type { Block } from 'payload/types'
import { COLLECTION_SLUG_FORMS } from '@/payload/collections/config'

const FormBlock: Block = {
  slug: 'FormBlock',
  interfaceName: 'FormBlock',
  fields: [
    {
      name: 'title',
      type: 'text'
    },
    {
      name: 'description',
      type: 'textarea'
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: COLLECTION_SLUG_FORMS,
      required: true
    }
  ]
}

export default FormBlock
