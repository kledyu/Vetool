'use client'

import { TableCell } from '@/components/ui/table'
import { DEFAULT_ICU_ORDER_TYPE } from '@/constants/hospital/icu/chart/order'
import { useCreateOrderStore } from '@/lib/store/icu/create-order'
import { cn } from '@/lib/utils'
import type { CopiedOrder, IcuChartOrderJoined } from '@/types/icu'

export default function OrderTitle({
  order,
  preview,
}: {
  order: CopiedOrder | IcuChartOrderJoined
  preview?: boolean
}) {
  const {
    icu_chart_order_type: orderType,
    icu_chart_order_name: orderName,
    icu_chart_order_comment: orderComment,
  } = order

  const { toggleModal, setIsEditMode, setChartOrder } = useCreateOrderStore()

  const handleDialogOpen = () => {
    if (preview) return

    toggleModal()
    setIsEditMode(true)
    setChartOrder(order as IcuChartOrderJoined)
  }

  return (
    <TableCell
      className={cn(
        preview ? 'cursor-default' : 'cursor-pointer',
        'flex w-[296px] items-center justify-between gap-2 transition hover:opacity-70',
      )}
      onClick={handleDialogOpen}
      title={orderComment ?? ''}
      style={{
        background: DEFAULT_ICU_ORDER_TYPE.find(
          (order) => order.value === orderType,
        )?.color,
      }}
    >
      <span className="min-w-16 truncate">{orderName}</span>
      <span className="min-w-16 truncate text-right text-xs text-muted-foreground">
        {orderComment}
      </span>
    </TableCell>
  )
}
