import React from 'react'
import cn from '@/utils/cn'

type MarqueeProps = React.ComponentPropsWithoutRef<'div'> & {
  blur?: boolean
  speed?: number
  blurIntensity?: number
  blurs?: number
  state?: 'running' | 'paused'
}

type MarqueeBlurProps = {
  count: number
}

type MarqueeItemProps = React.ComponentPropsWithoutRef<'li'> & {
  index: number
}

const styles = {
  blur: 'absolute top-0 bottom-0 w-[--mask-fade-distance] max-w-[70px] md:max-w-[240px] z-[2] pointer-events-none [.marquee[data-blurring="true"]_&]:opacity-100 [&>div]:backdrop-blur-[calc((var(--index,0)*var(--blur,0))*2px)] [&>div]:[mask-image:linear-gradient(90deg,transparent_calc(var(--index)*calc((100/var(--blurs))*1%)),black_calc((var(--index)+1)*calc((100/var(--blurs))*1%)),black_calc((var(--index)+2)*calc((100/var(--blurs))*1%)),transparent_calc((var(--index)+3)*calc((100/var(--blurs))*1%)))]',
  mask: '[--mask-fade-distance:160px] [mask-image:_linear-gradient(to_right,transparent_0,_black_var(--mask-fade-distance),_black_calc(100%-var(--mask-fade-distance)),transparent_100%)]',
  vars: '[--mask-fade-distance:160px]'
}

const MarqueeBlur: React.FC<MarqueeBlurProps & { position?: 'left' | 'right' }> = ({ count, position = 'left' }) => {
  const positionStyle = position === 'left' ? 'left-0 !rotate-180' : 'right-0'

  return (
    <div className={`${styles.blur} ${positionStyle}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className="absolute inset-0 z-[--index]" style={{ '--index': index } as React.CSSProperties} />
      ))}
    </div>
  )
}

const Marquee: React.FC<MarqueeProps> = ({
  children,
  blur = true,
  speed = 20,
  blurIntensity = 0.8,
  blurs = 8,
  state = 'running',
  className,
  ...props
}) => {
  return (
    <>
      <style>{`
        @keyframes marquee {
          100% {
            translate: var(--destination-x) var(--destination-y);
          }
        }
      `}</style>
      <div
        className={cn('marquee group relative min-h-[100px] w-full min-w-[300px]', styles.vars, className)}
        data-direction="horizontal"
        data-blurring={blur}
        data-play-state={state}
        style={
          {
            '--speed': speed,
            '--count': React.Children.count(children),
            '--blur': blurIntensity,
            '--blurs': blurs
          } as React.CSSProperties
        }
        {...props}>
        <div className={`grid min-h-[100px] min-w-[300px] ${styles.mask}`}>
          {blur ? <MarqueeBlur position="left" count={React.Children.count(children)} /> : null}
          <ul
            className="pointer-events-none flex h-full w-full items-center p-0 group-data-[play-state='paused']:![animation-play-state:paused]
              group-data-[play-state='running']:![animation-play-state:running]">
            {children}
          </ul>
          {blur ? <MarqueeBlur position="right" count={React.Children.count(children)} /> : null}
        </div>
      </div>
    </>
  )
}

Marquee.displayName = 'Marquee'

const MarqueeItem: React.FC<MarqueeItemProps> = ({ index, className, ...props }) => (
  <li
    key={`index--${index}`}
    style={{ '--index': index } as React.CSSProperties}
    className={cn(
      `grid w-full animate-[marquee_var(--duration)_var(--delay)_infinite_linear_paused] place-items-center text-[clamp(2rem,4vw+1rem,8rem)]
      [--delay:calc((var(--duration)/var(--count))*(var(--index,0)*-1))] [--destination-x:calc(calc((var(--index)+1+var(--outset,0))*-100%))]
      [--destination-y:0] [--duration:calc(var(--speed)*1s)] [--origin-x:calc(((var(--count)-var(--index))+var(--inset,0))*100%)] [--origin-y:0]
      [translate:var(--origin-x)_var(--origin-y)] group-data-[play-state='paused']:![animation-play-state:paused]
      group-data-[play-state='running']:![animation-play-state:running]`,
      className
    )}
    {...props}
  />
)

MarqueeItem.displayName = 'MarqueeItem'

export { Marquee, MarqueeItem }
