import Container from '@/components/Container'
import { LogoMarqueeBlock, Media } from '~/payload-types'
import { Marquee, MarqueeItem } from '../Marquee'
import Image from 'next/image'
import isNotNull from '@/payload/utils/isNotNull'
import _isObject from 'lodash/isObject'
import { AdditionalBlockProps } from '@/components/Blocks'

type MediaWithSvg = Media & { svg?: string }

async function fetchSVG(url: string): Promise<string> {
  const response = await fetch(url, { next: { revalidate: 86400 } })
  return response.text()
}

export default async function LogoMarquee({ logos, speed }: LogoMarqueeBlock & AdditionalBlockProps) {
  if (!Array.isArray(logos)) return null
  if (!speed) speed = 20

  const promises = logos.map(async ({ logo }) => {
    if (_isObject(logo) && isNotNull(logo.url)) {
      if (logo.url.endsWith('.svg')) {
        return { ...logo, svg: await fetchSVG(logo.url) }
      }
      return { ...logo, svg: null }
    }
    return null
  })

  const results = await Promise.all(promises)
  const formattedLogos = results.filter((result) => result !== null) as MediaWithSvg[]

  return (
    <section className="max-w-[100vw] overflow-x-hidden py-6">
      <Container className="px-0">
        <Marquee blur={false} speed={speed}>
          {formattedLogos.map((logo, index) => (
            <MarqueeItem key={index} index={index} className="px-3 sm:px-7">
              {logo.svg && (
                <div
                  className="relative inline-flex aspect-video h-full w-[160px] items-center dark:text-zinc-500 sm:w-[180px] [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: logo.svg }}
                />
              )}
              {!logo.svg && logo.url && (
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
