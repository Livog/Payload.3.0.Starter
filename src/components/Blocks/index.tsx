import dynamic from 'next/dynamic'

const HeroBanner = dynamic(() => import('./HeroBanner'))
const FeaturedGrid = dynamic(() => import('./FeaturedGrid'))
const LogoMarquee = dynamic(() => import('./LogoMarquee'))
const Faq = dynamic(() => import('./Faq'))
const Form = dynamic(() => import('./Form'))
const RichText = dynamic(() => import('./RichText'))

export type AdditionalBlockProps = {
  blockIndex: number
  locale: string
}

const blockComponents = {
  HeroBanner: HeroBanner,
  FeaturesGrid: FeaturedGrid,
  LogoMarquee: LogoMarquee,
  Faq: Faq,
  FormBlock: Form,
  RichText: RichText
}

const Blocks = ({ blocks, locale }: any) => {
  return (
    <>
      {blocks
        ?.filter((block: any) => block && block.blockType && blockComponents.hasOwnProperty(block.blockType))
        .map((block: any, ix: number) => {
          // @ts-ignore
          const BlockComponent = blockComponents[block.blockType] ?? null
          return BlockComponent ? <BlockComponent key={ix} {...block} blockIndex={ix} locale={locale} /> : null
        })}
    </>
  )
}

export default Blocks
