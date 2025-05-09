import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import useShortcutKey from '@/hooks/use-shortcut-key'
import { reorderDefaultOrders } from '@/lib/services/admin/icu/default-orders'
import { reorderOrders } from '@/lib/services/icu/chart/order-mutation'
import { cn, hasOrderSortingChanged } from '@/lib/utils/utils'
import { type SelectedIcuOrder } from '@/types/icu/chart'
import { ArrowUpDown } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

type SortingButtonProps = {
  isSorting: boolean
  prevOrders: SelectedIcuOrder[]
  sortedOrders: SelectedIcuOrder[]
  setIsSorting: Dispatch<SetStateAction<boolean>>
  isDt?: boolean
  isSetting?: boolean
}

export default function SortingButton({
  isSorting,
  prevOrders,
  sortedOrders,
  setIsSorting,
  isDt,
  isSetting,
}: SortingButtonProps) {
  const handleSortButtonClick = async () => {
    if (!isSorting) {
      toast({
        title: '오더를 Drag & Drop 하여 순서를 변경해주세요',
        description: '"CTRL + S" 또는 "ESC"를 눌러 순서 변경을 완료해주세요',
      })
      setIsSorting(true)
    }

    if (isSorting && !hasOrderSortingChanged(prevOrders, sortedOrders)) {
      setIsSorting(false)
      return
    }

    if (isSorting) {
      const orderIds = sortedOrders.map((order) => order.order_id)

      // default, template
      isDt
        ? await reorderDefaultOrders(orderIds)
        : await reorderOrders(orderIds)

      setIsSorting(false)
      toast({ title: '오더 순서를 변경하였습니다' })
    }
  }

  useShortcutKey({
    key: 'Escape',
    ignoreInput: true,
    condition: isSorting,
    callback: handleSortButtonClick,
    requireCtrl: false,
  })

  useShortcutKey({
    key: 's',
    ignoreInput: true,
    callback: handleSortButtonClick,
  })

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isSetting}
      className={cn(
        isSorting && 'animate-pulse text-primary',
        'hidden shrink-0 md:flex',
      )}
      onClick={handleSortButtonClick}
    >
      <ArrowUpDown size={18} />
    </Button>
  )
}
