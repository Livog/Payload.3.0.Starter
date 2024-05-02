import type { Config } from 'tailwindcss'
import tailwindTypography from '@tailwindcss/typography'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindAnimate from 'tailwindcss-animate'
import defaultTheme from 'tailwindcss/defaultTheme'

const config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        inter: ['InterVariable', 'Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        zinc: {
          50: '#fafafa',
          100: '#f6f6f6',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#858585',
          600: '#52525b',
          700: '#393939',
          800: '#242424',
          900: '#161616',
          920: '#1c1c1c',
          940: '#161616',
          950: '#09090b'
        }
      }
    }
  },
  plugins: [tailwindTypography(), tailwindAnimate]
} satisfies Config

export default config

export const tailwindConfig = resolveConfig(config)
