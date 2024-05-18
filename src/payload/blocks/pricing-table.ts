import type { Block } from 'payload/types'
import { COLLECTION_SLUG_PRODUCTS } from '../collections/config'

const PricingTable: Block = {
  slug: 'PricingTable',
  interfaceName: 'PricingTableBlock',
  fields: [
    {
      type: 'text',
      name: 'title'
    },
    {
      type: 'array',
      name: 'products',
      fields: [
        {
          type: 'relationship',
          name: 'product',
          relationTo: [COLLECTION_SLUG_PRODUCTS]
        }
      ]
    }
  ]
}

export default PricingTable
