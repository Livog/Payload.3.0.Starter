import Container from '@/components/Container'
import isNotNull from '@/payload/utils/isNotNull'
import cn from '@/utils/cn'
import Image from 'next/image'
import { HeroBannerBlock } from '~/payload-types'
import { AdditionalBlockProps } from '@/components/Blocks'

const HeroBanner = ({ title, subtitle, preTitle, backgroundImage, settings, blockIndex }: HeroBannerBlock & AdditionalBlockProps) => {
  const imageSrc = typeof backgroundImage === 'object' ? backgroundImage?.url : null
  const invertBackgroundImageInDarkMode = (settings || []).includes('invertBackgroundImageInDarkMode')

  return (
    <section className="relative flex h-[50dvh] min-h-[500px] md:h-[70dvh]">
      <div className="relative z-10 flex grow items-center">
        <Container>
          <div className="space-y-6 md:mb-20">
            {isNotNull(preTitle) && <span className="inline-block rounded-md text-sm font-semibold dark:text-zinc-500">{preTitle}</span>}
            {isNotNull(title) && (
              <h2 className="max-w-xl text-4xl font-extrabold tracking-tight dark:text-zinc-100 sm:text-5xl md:text-6xl">{title}</h2>
            )}
            {isNotNull(subtitle) && <p className="mt-4 max-w-2xl text-2xl text-zinc-700 dark:text-zinc-500">{subtitle}</p>}
          </div>
        </Container>
      </div>
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          loading={blockIndex > 2 ? 'lazy' : 'eager'}
          className={cn(
            'z-[-1] !h-screen !w-[100vw] object-cover object-top [mask-image:_linear-gradient(to_top,transparent_250px,_theme(colors.zinc.940))]',
            invertBackgroundImageInDarkMode && 'invert dark:invert-0'
          )}
        />
      )}
    </section>
  )
}

export default HeroBanner
