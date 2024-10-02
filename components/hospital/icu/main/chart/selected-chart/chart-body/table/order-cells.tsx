'use client'

import { toast } from '@/components/ui/use-toast'
import { TIMES } from '@/constants/hospital/icu/chart/time'
import { updateOrderTime } from '@/lib/services/icu/chart/order-mutation'
import type { SelectedIcuOrder } from '@/types/icu/chart'
import { useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Cell from './cell'

export default function OrderCells({
  preview,
  order,
  icuIoId,
}: {
  preview?: boolean
  order: SelectedIcuOrder
  icuIoId: string
}) {
  const { order_times, order_id, treatments, order_name } = order

  const [orderTimeState, setOrderTimeState] = useState(order_times)

  useEffect(() => {
    setOrderTimeState(order_times)
  }, [order_times])

  const handleUpdateOrderTime = useDebouncedCallback(
    (newOrderTime: string[]) => {
      updateOrderTime(order_id, newOrderTime)
      toast({
        title: '오더 시간을 변경하였습니다.',
      })
    },
    3000,
  )

  const toggleOrderTime = useCallback(
    (time: number) => {
      setOrderTimeState((prevOrderTime) => {
        const newOrderTime = [...prevOrderTime]
        newOrderTime[time - 1] = newOrderTime[time - 1] === '1' ? '0' : '1'
        handleUpdateOrderTime(newOrderTime)
        return newOrderTime
      })
    },
    [handleUpdateOrderTime],
  )

  return (
    <>
      {TIMES.map((time, index) => {
        const isDone =
          order_times[index] === '1' &&
          treatments.some((treatment) => treatment.time === time)

        const hasOrder = orderTimeState[time - 1] === '1'

        const selectedTx = treatments.find(
          (treatment) => treatment.time === time,
        )
        return (
          <Cell
            preview={preview}
            key={time}
            time={time}
            treatment={selectedTx}
            icuIoId={icuIoId}
            icuChartOrderId={order_id}
            isDone={isDone}
            hasOrder={hasOrder}
            icuChartOrderName={order_name}
            icuChartTxId={selectedTx?.tx_id}
            toggleOrderTime={toggleOrderTime}
            handleUpdateOrderTime={handleUpdateOrderTime}
          />
        )
      })}
    </>
  )
}
