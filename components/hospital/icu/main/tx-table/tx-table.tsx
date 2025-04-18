'use client'

import NoResultSquirrel from '@/components/common/no-result-squirrel'
import PatientBriefInfo from '@/components/hospital/common/patient/patient-brief-info'
import TxUpsertDialog from '@/components/hospital/icu/main/chart/selected-chart/chart-body/table/tx/tx-upsert-dialog'
import TxTableCell from '@/components/hospital/icu/main/tx-table/tx-table-cell'
import TxTableHeader from '@/components/hospital/icu/main/tx-table/tx-table-header'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { TIMES } from '@/constants/hospital/icu/chart/time'
import { useIcuTxStore } from '@/lib/store/icu/icu-tx'
import { type IcuOrderColors } from '@/types/adimin'
import { type IcuTxTableData } from '@/types/icu/tx-table'
import { SquarePlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  localFilterState: string[]
  filteredTxData: IcuTxTableData[]
  chartBackgroundMap: Record<string, string>
  hasOrder: boolean
  showTxUser: boolean
  orderColorsData: IcuOrderColors
}

export default function TxTable({
  localFilterState,
  filteredTxData,
  chartBackgroundMap,
  hasOrder,
  showTxUser,
  orderColorsData,
}: Props) {
  const { setTxStep, setTxLocalState } = useIcuTxStore()

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)

  const [isScrolled, setIsScrolled] = useState(false)

  const getCurrentScrollPosition = () => {
    const currentHour = new Date().getHours() - 5
    if (!tableRef.current) return 0
    if (currentHour <= 5) return 0
    const headerCells = Array.from(tableRef.current.querySelectorAll('th'))
    return headerCells.slice(1, currentHour + 1).reduce((total, cell) => {
      return total + cell.offsetWidth
    }, 0)
  }

  useEffect(() => {
    const scrollToCurrentTime = () => {
      const scrollContainer = scrollAreaRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]',
      ) as HTMLDivElement | null

      if (scrollContainer) {
        const scrollPosition = getCurrentScrollPosition()
        scrollContainer.style.scrollBehavior = 'smooth'
        scrollContainer.scrollLeft = scrollPosition
      }
    }

    const timeoutId = setTimeout(() => {
      if (!isScrolled) {
        setIsScrolled(true)
        scrollToCurrentTime()
      }
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [isScrolled])

  // 필터 적용 비활성화
  // const orderType = localFilterState.map(
  //   (orderType) =>
  //     DEFAULT_ICU_ORDER_TYPE.find((type) => type.value === orderType)?.label,
  // )

  if (!hasOrder) {
    return (
      <NoResultSquirrel
        text={`모든 처치를 완료했습니다`}
        className="h-screen flex-col"
        size="lg"
      />
    )
  }

  return (
    <>
      <ScrollArea
        ref={scrollAreaRef}
        className="h-mobile overflow-scroll whitespace-nowrap 2xl:w-[calc(100vw-250px)]"
      >
        <Table className="border border-l-0" ref={tableRef}>
          <TxTableHeader
            filteredTxData={filteredTxData}
            localFilterState={localFilterState}
          />

          <TableBody>
            {filteredTxData.flatMap((txData) =>
              txData.orders.map((order) => (
                <TableRow
                  key={order.icu_chart_order_id}
                  style={{
                    background:
                      chartBackgroundMap[txData.icu_charts.icu_chart_id],
                  }}
                  className="divide-x"
                >
                  <TableCell className="sticky left-0 z-20 bg-white text-center shadow-md">
                    <PatientBriefInfo
                      name={txData.patient.name}
                      breed={txData.patient.breed}
                      species={txData.patient.species}
                      iconSize={18}
                      col
                    />

                    <div className="flex flex-col justify-center gap-1">
                      <span className="text-xs">
                        {txData.icu_charts.weight}kg
                      </span>

                      {txData.icu_io.cage && (
                        <div className="flex items-center justify-center gap-1 text-muted-foreground">
                          <SquarePlus size={12} />
                          <span className="text-xs">{txData.icu_io.cage}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {TIMES.map((time) => (
                    <TxTableCell
                      patientName={txData.patient.name}
                      key={time}
                      time={time}
                      order={order}
                      patientId={txData.patient_id}
                      setTxStep={setTxStep}
                      setTxLocalState={setTxLocalState}
                      orderColorsData={orderColorsData}
                    />
                  ))}
                </TableRow>
              )),
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TxUpsertDialog showTxUser={showTxUser} />
    </>
  )
}
