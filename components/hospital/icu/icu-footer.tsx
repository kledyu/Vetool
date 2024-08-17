'use client'

import { Button } from '@/components/ui/button'
import { useSelectedMainViewStore } from '@/lib/store/icu/selected-main-view'

export const FOOTER_MAIN_VIEW_MENUS = [
  {
    label: '종합 현황',
    value: 'summary',
  },
  {
    label: '처치표',
    value: 'tx-table',
  },
  {
    label: '입원 차트',
    value: 'chart',
  },
  {
    label: '차트 검색',
    value: 'search',
  },
] as const

export default function IcuFooter() {
  const { selectIcudMainView, setSelectedIcuMainView } =
    useSelectedMainViewStore()

  return (
    <footer className="fixed bottom-0 h-10 w-full border-t bg-white">
      <ul className="flex h-full items-center gap-2 pl-1">
        {FOOTER_MAIN_VIEW_MENUS.map(({ label, value }) => (
          <li key={value}>
            <Button
              size="sm"
              variant="ghost"
              className={selectIcudMainView === value ? 'bg-muted' : ''}
              onClick={() => setSelectedIcuMainView(value)}
            >
              {label}
            </Button>
          </li>
        ))}
      </ul>
    </footer>
  )
}
