import CalculatorSheet from '@/components/hospital/calculator/calculator-sheet'
import Feedback from '@/components/hospital/feedback/feedback'
import SidebarItem from '@/components/hospital/sidebar/desktop/desktop-sidebar-item'
import SidebarUserInfo from '@/components/hospital/sidebar/sidebar-user-info'
import { SIDEBAR_ITEMS } from '@/constants/hospital/sidebar-items'
import { type VetoolUser } from '@/types'
import { type Plans } from '@/types/adimin'

type Props = {
  hosId: string
  vetoolUser: VetoolUser
  plan: Plans
}

export default async function DesktopSidebar({
  hosId,
  vetoolUser,
  plan,
}: Props) {
  return (
    <aside className="item-center fixed left-0 top-0 z-50 hidden h-screen w-14 flex-col justify-between border-r bg-white 2xl:flex">
      <ul>
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem
            name={item.name}
            path={item.path}
            key={item.name}
            isReady={item.isReady}
            icon={item.icon}
            isSuper={vetoolUser.is_super}
          />
        ))}
      </ul>

      <div className="mb-2 flex flex-col items-center justify-end gap-2">
        <CalculatorSheet plan={plan} />
        <Feedback />
        <SidebarUserInfo hosId={hosId} vetoolUser={vetoolUser} />
      </div>
    </aside>
  )
}
