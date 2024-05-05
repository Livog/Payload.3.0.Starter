import ThemeChanger from '@/components/ThemeChanger'
import Container from '@/components/Container'
import Logo from '@/public/logo.svg'
import getSiteSettings from '@/payload/utils/fetchSiteSettings'

const Footer = async () => {
  const settings = await getSiteSettings()
  return (
    <footer className="border-t border-zinc-200 p-10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center space-x-2">
              <Logo className="h-10 w-10" />
              {settings?.appName ? <span className="text-xl font-bold">{settings?.appName}</span> : null}
            </div>
            {settings?.appDescription ? <p className="text-zinc-500">{settings?.appDescription}</p> : null}
            <div className="mt-6 flex items-center space-x-4"></div>
          </div>
          <div className="col-span-2 gap-8 md:col-span-2 md:grid md:grid-cols-2">
            <div>
              <ul className="space-y-2">
                <li>
                  <a className="transition-colors hover:text-gray-300" href="#">
                    Home
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-gray-300" href="#">
                    Components
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-gray-300" href="#">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li>
                  <a className="transition-colors hover:text-gray-300" href="#">
                    FAQ
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-gray-300" href="#">
                    Contact
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-gray-300" href="#">
                    License
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-between border-t border-zinc-700 pt-6 text-left text-sm text-zinc-500">
          <p>{settings?.footer?.copyright ? settings?.footer?.copyright : `© ${new Date().getFullYear()}. All rights reserved.`}</p>
          <div>
            <ThemeChanger />
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
