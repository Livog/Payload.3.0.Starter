import HeroBanner from './HeroBanner'
import FeaturedGrid from './FeaturedGrid'
import LogoMarquee from './LogoMarquee'
import Faq from './Faq'
import Form from './Form'
import RichText from './RichText'
import PricingTable from './PricingTable'

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
  RichText: RichText,
  PricingTable: PricingTable
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
