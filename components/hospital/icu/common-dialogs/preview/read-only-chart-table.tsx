'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DEFAULT_ICU_ORDER_TYPE } from '@/constants/hospital/icu/chart/order'
import { TIMES } from '@/constants/hospital/icu/chart/time'
import { useBasicHosDataContext } from '@/providers/basic-hos-data-context-provider'
import { IcuOrderColors } from '@/types/adimin'
import type { IcuReadOnlyOrderData } from '@/types/icu/chart'
import { useEffect, useState } from 'react'

export default function ReadOnlyChartTable({
  chartOrderData,
}: {
  chartOrderData: IcuReadOnlyOrderData[]
}) {
  const [sortedOrders, setSortedOrders] = useState<IcuReadOnlyOrderData[]>([])
  const {
    basicHosData: { orderColorsData },
  } = useBasicHosDataContext()

  useEffect(() => {
    const sorted = chartOrderData
      .sort((prev, next) =>
        prev.icu_chart_order_name.localeCompare(next.icu_chart_order_name),
      )
      .sort(
        (prev, next) =>
          DEFAULT_ICU_ORDER_TYPE.map((order) => order.value).findIndex(
            (order) => order === prev.icu_chart_order_type,
          ) -
          DEFAULT_ICU_ORDER_TYPE.map((order) => order.value).findIndex(
            (order) => order === next.icu_chart_order_type,
          ),
      )

    setSortedOrders(sorted)
  }, [chartOrderData])

  return (
    <Table className="border">
      <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
        <TableRow>
          <TableHead className="w-[320px] text-center">오더 목록</TableHead>
          {TIMES.map((time) => (
            <TableHead className="border text-center" key={time}>
              {time.toString().padStart(2, '0')}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {sortedOrders.map((order) => (
          <TableRow className="divide-x" key={order.icu_chart_order_id}>
            <TableCell
              className="w-[320px] p-0"
              style={{
                background:
                  orderColorsData[
                    order.icu_chart_order_type as keyof IcuOrderColors
                  ],
              }}
            >
              <div
                className={
                  'flex h-11 w-[320px] cursor-not-allowed items-center justify-between rounded-none bg-transparent px-2 outline-none ring-inset ring-primary'
                }
              >
                <span className="truncate">
                  {order.icu_chart_order_name.split('#')[0]}
                </span>
                <span className="min-w-16 truncate text-right text-xs text-muted-foreground">
                  {order.icu_chart_order_comment}{' '}
                  {order.icu_chart_order_type === 'fluid' && 'ml/hr'}
                </span>
              </div>
            </TableCell>

            {order.icu_chart_order_time.map((time, index) => (
              <TableHead key={index} className="text-center">
                {time !== '0' && <span>{time}</span>}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
