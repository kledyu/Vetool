import MaxWidthContainer from '@/components/common/max-width-container'
import VetoolLogo from '@/components/common/vetool-logo'
import NavMenu from '@/components/company/header/nav/nav-menu'
import SlideButton from '@/components/company/main/feature/ui/slide-button'
import Link from 'next/link'

export default function HomepageHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/95">
      <MaxWidthContainer>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/#hero">
              <VetoolLogo />
            </Link>

            <NavMenu />
          </div>

          <div className="flex items-center gap-2">
            <SlideButton variant="outline" asChild>
              <Link href="/login" className="font-bold">
                로그인
              </Link>
            </SlideButton>
          </div>
        </div>
      </MaxWidthContainer>
    </header>
  )
}
