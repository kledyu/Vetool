import OrderRowCells from '@/components/hospital/icu/main/chart/selected-chart/chart-body/table/chart-table-body/order-row-cells'
import OrderRowTitle from '@/components/hospital/icu/main/chart/selected-chart/chart-body/table/chart-table-body/order-row-title'
import { TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'
import useShorcutKey from '@/hooks/use-shortcut-key'
import { upsertOrder } from '@/lib/services/icu/chart/order-mutation'
import {
  type OrderStep,
  OrderTimePendingQueue,
  useIcuOrderStore,
} from '@/lib/store/icu/icu-order'
import { useIcuTxStore } from '@/lib/store/icu/icu-tx'
import { borderedOrderClassName } from '@/lib/utils/utils'
import { type VitalRefRange } from '@/types/adimin'
import { type SelectedIcuOrder } from '@/types/icu/chart'
import { type RefObject } from 'react'

type Props = {
  sortedOrders: SelectedIcuOrder[]
  isSorting: boolean
  preview?: boolean
  showOrderer: boolean
  showTxUser: boolean
  selectedTxPendingQueue: OrderTimePendingQueue[]
  orderTimePendingQueueLength: number
  vitalRefRange: VitalRefRange[]
  species: string
  orderwidth: number
  cellRef?: RefObject<HTMLTableRowElement>
  icuChartId: string
  hosId: string
  setOrderStep: (orderStep: OrderStep) => void
  selectedOrderPendingQueue: Partial<SelectedIcuOrder>[]
  resetOrderStore: () => void
  timeGuidelineData: number[]
  orderTimePendingQueue: OrderTimePendingQueue[]
}

export default function OrderRows({
  sortedOrders,
  isSorting,
  preview,
  showOrderer,
  showTxUser,
  selectedTxPendingQueue,
  orderTimePendingQueueLength,
  vitalRefRange,
  species,
  orderwidth,
  cellRef,
  icuChartId,
  hosId,
  setOrderStep,
  selectedOrderPendingQueue,
  resetOrderStore,
  timeGuidelineData,
  orderTimePendingQueue,
}: Props) {
  const {
    setSelectedChartOrder,
    setSelectedOrderPendingQueue,
    copiedOrderPendingQueue,
    setOrderTimePendingQueue,
    setSelectedTxPendingQueue,
  } = useIcuOrderStore()

  const {
    isMutationCanceled,
    setIsMutationCanceled,
    setTxStep,
    setTxLocalState,
  } = useIcuTxStore()

  useShorcutKey({
    key: 'v',
    condition: copiedOrderPendingQueue.length > 0,
    callback: showOrderer
      ? () => setOrderStep('selectOrderer')
      : () => handleUpsertOrderWithoutOrderer(),
  })

  const handleUpsertOrderWithoutOrderer = async () => {
    for (const order of copiedOrderPendingQueue) {
      await upsertOrder(hosId, icuChartId, undefined, order.order_times!, {
        icu_chart_order_name: order.order_name!,
        icu_chart_order_comment: order.order_comment!,
        icu_chart_order_type: order.order_type!,
        icu_chart_order_priority: order.id!,
        is_bordered: order.is_bordered!,
      })
    }
    toast({
      title: '오더를 붙여넣었습니다',
    })
    resetOrderStore()
  }

  return (
    <>
      {sortedOrders.map((order, index) => {
        const isInOrderPendingQueue = selectedOrderPendingQueue.some(
          (o) => o.order_id === order.order_id,
        )
        return (
          <TableRow
            className="relative w-full divide-x"
            key={order.order_id}
            ref={cellRef}
            style={borderedOrderClassName(sortedOrders, order, index)}
          >
            <OrderRowTitle
              isInOrderPendingQueue={isInOrderPendingQueue}
              index={index}
              order={order}
              preview={preview}
              isSorting={isSorting}
              vitalRefRange={vitalRefRange}
              species={species}
              orderWidth={orderwidth}
              resetOrderStore={resetOrderStore}
              setSelectedOrderPendingQueue={setSelectedOrderPendingQueue}
              setOrderStep={setOrderStep}
              setSelectedChartOrder={setSelectedChartOrder}
            />

            <OrderRowCells
              hosId={hosId}
              preview={preview}
              order={order}
              showOrderer={showOrderer}
              showTxUser={showTxUser}
              selectedTxPendingQueue={selectedTxPendingQueue}
              orderTimePendingQueueLength={orderTimePendingQueueLength}
              vitalRefRange={vitalRefRange}
              species={species}
              setOrderTimePendingQueue={setOrderTimePendingQueue}
              setSelectedTxPendingQueue={setSelectedTxPendingQueue}
              isMutationCanceled={isMutationCanceled}
              setIsMutationCanceled={setIsMutationCanceled}
              setTxStep={setTxStep}
              setTxLocalState={setTxLocalState}
              timeGuidelineData={timeGuidelineData}
              orderTimePendingQueue={orderTimePendingQueue}
            />
          </TableRow>
        )
      })}
    </>
  )
}
