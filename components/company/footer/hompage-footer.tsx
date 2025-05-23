import MaxWidthContainer from '@/components/common/max-width-container'
import { Separator } from '@/components/ui/separator'
import { OPEN_KAKAO_URL } from '@/constants/company/main'
import Link from 'next/link'

export default function HomepageFooter() {
  return (
    <footer className="border-t bg-gray-50 py-16">
      <MaxWidthContainer>
        <div className="flex gap-4">
          <Link href="/terms-of-service" className="text-xs md:text-base">
            이용약관
          </Link>
          <Link href="/privacy-policy" className="text-xs md:text-base">
            개인정보처리방침
          </Link>
          <Link href="/announcement" className="text-xs md:text-base">
            공지사항
          </Link>
        </div>

        <div className="my-8 flex flex-col justify-between gap-8 md:flex-row md:gap-0">
          <div>
            <p className="text-sm font-semibold leading-relaxed tracking-tighter md:text-lg">
              (주) 벳툴
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
              대표: 이정우 | 사업자등록번호: 658-86-02970
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
              주소: 송파구 송파대로 260 5-20
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold md:text-sm">이용문의</p>

            <div className="flex flex-col">
              <Link
                href="mailto:vetool.co@gmail.com"
                className="text-xs text-muted-foreground underline md:text-sm"
              >
                vetool.co@gmail.com
              </Link>

              <Link
                href={OPEN_KAKAO_URL}
                target="_blank"
                className="text-xs text-muted-foreground underline md:text-sm"
              >
                카카오 문의
              </Link>
            </div>
          </div>
        </div>

        <br />

        <Separator className="mb-4" />
        <p className="text-sm tracking-tighter text-muted-foreground">
          &copy; Vetool Co, Ltd. All rights reserved.
        </p>
      </MaxWidthContainer>
    </footer>
  )
}
