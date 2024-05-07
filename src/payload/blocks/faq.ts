import type { Block } from 'payload/types'

const Faq: Block = {
  slug: 'Faq',
  interfaceName: 'FaqBlock',
  fields: [
    {
      type: 'text',
      name: 'title'
    },
    {
      type: 'array',
      name: 'questions',
      fields: [
        {
          type: 'text',
          name: 'question'
        },
        {
          // @todo: remove unneeded features
          type: 'richText',
          name: 'answer'
          // editor: lexicalEditor({
          //   features: () => [ParagraphFeature(), LinkFeature()]
          // })
        }
      ]
    }
  ]
}

export default Faq
