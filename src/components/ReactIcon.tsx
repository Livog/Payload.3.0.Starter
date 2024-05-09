import dynamic from 'next/dynamic'
import React from 'react'
import { IconBaseProps, IconType } from 'react-icons/lib'

/** Comment out the icons you don't need */
const iconComponents = {
  //Ai: () => import('react-icons/ai'),
  //Bs: () => import('react-icons/bs'),
  //Bi: () => import('react-icons/bi'),
  //Ci: () => import('react-icons/ci'),
  //Di: () => import('react-icons/di'),
  //Fi: () => import('react-icons/fi'),
  //Fc: () => import('react-icons/fc'),
  //Fa: () => import('react-icons/fa6'),
  //Gi: () => import('react-icons/gi'),
  //Go: () => import('react-icons/go'),
  //Gr: () => import('react-icons/gr'),
  Hi: () => import('react-icons/hi2')
  // Im: () => import('react-icons/im'),
  // Lia: () => import('react-icons/lia'),
  // Io: () => import('react-icons/io5'),
  // Lu: () => import('react-icons/lu'),
  // Md: () => import('react-icons/md'),
  // Pi: () => import('react-icons/pi'),
  // Rx: () => import('react-icons/rx'),
  // Ri: () => import('react-icons/ri'),
  // Si: () => import('react-icons/si'),
  // Sl: () => import('react-icons/sl'),
  // Tb: () => import('react-icons/tb'),
  // Tfi: () => import('react-icons/tfi'),
  // Ti: () => import('react-icons/ti'),
  // Vsc: () => import('react-icons/vsc'),
  // Wi: () => import('react-icons/wi'),
  // Cg: () => import('react-icons/cg')
} as const

type IconKey = keyof typeof iconComponents

interface ReactIconProps extends IconBaseProps {
  icon: string
}

const ReactIcon: React.FC<ReactIconProps> = ({ icon, size = '1em', color = null, className = '' }) => {
  const matchingPrefix = Object.keys(iconComponents).find((key) => icon.startsWith(key)) as IconKey | undefined
  if (matchingPrefix) {
    const importModule = iconComponents[matchingPrefix] as any
    const IconComponent = dynamic(() => importModule().then((allIcons: Record<string, IconType>) => allIcons[icon]))
    // @ts-ignore
    return <IconComponent className={className} size={size} color={color} />
  }

  return <></>
}
export default ReactIcon
