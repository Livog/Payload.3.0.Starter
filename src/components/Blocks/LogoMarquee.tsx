import { AdditionalBlockProps } from '@/components/Blocks'
import Container from '@/components/Container'
import _isObject from 'lodash/isObject'
import Image from 'next/image'
import { LogoMarqueeBlock, Media } from '~/payload-types'
import { Marquee, MarqueeItem } from '../Marquee'

export default function LogoMarquee({ logos, speed }: LogoMarqueeBlock & AdditionalBlockProps) {
  if (!Array.isArray(logos)) return null
  if (!speed) speed = 20

  const formattedLogos = logos.filter(({ logo }) => _isObject(logo)) as { logo: Media; id: string }[]

  return (
    <section className="max-w-[100vw] overflow-x-hidden py-6">
      <Container className="px-0">
        <Marquee blur={false} speed={speed}>
          {formattedLogos.map(({ logo }, index) => (
            <MarqueeItem key={index} index={index} className="px-3 sm:px-7">
              {logo?.rawContent && (
                <div
                  className="relative inline-flex aspect-video h-full w-[160px] items-center dark:text-zinc-500 sm:w-[180px] [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: logo?.rawContent }}
                />
              )}
              {!logo?.rawContent && logo.url && (
                <div className="relative aspect-video h-full w-full">
                  <Image src={logo.url} alt="" fill className="object-contain" />
                </div>
              )}
            </MarqueeItem>
          ))}
        </Marquee>
      </Container>
    </section>
  )
}
