import OrderPreviewSkeleton from '@/components/hospital/icu/main/search/order-preview-skeleton'
import OrderPreviewTable from '@/components/hospital/icu/main/search/order-preview-table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { ORDER_OF_ORDERS } from '@/constants/hospital/icu/chart/order'
import { selectedChartOrderList } from '@/lib/services/icu/select-chart-list'
import { useCopiedChartStore } from '@/lib/store/icu/copied-chart'
import type { IcuChartOrderJoined } from '@/types/icu'
import { useEffect, useState } from 'react'

export default function OrderPreviewDialog({
  open,
  onOpenChange,
  register,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  register?: boolean
}) {
  const { copiedChartId, setCopiedChartOrder } = useCopiedChartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedChartOrders, setSelectedChartOrders] = useState<
    IcuChartOrderJoined[]
  >([])

  useEffect(() => {
    setIsLoading(true)

    const fetchChartOrderList = async () => {
      const fetchedChartOrders = await selectedChartOrderList(copiedChartId)

      const selectedChartOrders = fetchedChartOrders.sort(
        (prev, next) =>
          ORDER_OF_ORDERS.findIndex(
            (itme) => itme === prev.icu_chart_order_type,
          ) -
          ORDER_OF_ORDERS.findIndex(
            (itme) => itme === next.icu_chart_order_type,
          ),
      )
      setSelectedChartOrders(selectedChartOrders)

      setIsLoading(false)
    }

    fetchChartOrderList()
  }, [])

  const handleCopyButtonClick = () => {
    setCopiedChartOrder(selectedChartOrders)
    onOpenChange(false)

    toast({
      title: '차트 복사 완료',
      description: '해당 차트가 클립보드에 복사되었습니다',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-[1200px]">
        <DialogHeader>
          <DialogTitle>오더 미리보기</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <OrderPreviewSkeleton />
        ) : (
          <OrderPreviewTable selectedChartOrders={selectedChartOrders} />
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              닫기
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleCopyButtonClick}>
            {register ? '차트 선택' : '차트 복사'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
