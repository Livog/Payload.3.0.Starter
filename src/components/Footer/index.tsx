import ThemeChanger from '@/components/ThemeChanger'
import Container from '@/components/Container'

const Footer = () => {
  return (
    <footer className="py-6 text-white dark:bg-zinc-950">
      <Container>
        <div className="grid grid-cols-1 gap-x-3 gap-y-2 md:grid-cols-3">
          <div></div>

          <div></div>
          <div>
            <ThemeChanger />
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
