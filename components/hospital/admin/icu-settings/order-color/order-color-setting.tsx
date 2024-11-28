'use client'

import OrderColorPicker from '@/components/hospital/admin/icu-settings/order-color/order-color-picker'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { DEFAULT_ICU_ORDER_TYPE } from '@/constants/hospital/icu/chart/order'
import { updateOrderColor } from '@/lib/services/admin/icu/order-color'
import { cn } from '@/lib/utils/utils'
import type { IcuOrderColors } from '@/types/adimin'
import { LoaderCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import IcuSettingsCard from '../icu-settings-card'

export default function OrderColorSetting({
  orderColor,
}: {
  orderColor: IcuOrderColors
}) {
  const { hos_id } = useParams()
  const { refresh } = useRouter()
  const [locatColorState, setLocalColorState] = useState(orderColor)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleOrderColor = useCallback(
    async (orderType: string, color: string) => {
      setLocalColorState({ ...locatColorState, [orderType]: color })
    },
    [locatColorState],
  )

  const handleUpdateOrderColor = useCallback(async () => {
    setIsUpdating(true)

    await updateOrderColor(hos_id as string, locatColorState)
    toast({
      title: '오더의 색상을 변경하였습니다.',
    })

    setIsUpdating(false)
    refresh()
  }, [hos_id, locatColorState, refresh])

  const sortedOrders = useMemo(
    () =>
      Object.entries(locatColorState).sort((a, b) => {
        return (
          DEFAULT_ICU_ORDER_TYPE.map((order) => order.value).findIndex(
            (order) => order === a[0],
          ) -
          DEFAULT_ICU_ORDER_TYPE.map((order) => order.value).findIndex(
            (order) => order === b[0],
          )
        )
      }),
    [locatColorState],
  )

  return (
    <IcuSettingsCard
      title="오더 색상 설정"
      isUpdating={isUpdating}
      onSubmit={handleUpdateOrderColor}
    >
      <ul className="flex flex-wrap items-end gap-3">
        {sortedOrders.map(([key, value]) => (
          <li key={key}>
            <OrderColorPicker
              color={value}
              orderType={key}
              handleChangeOrderTypeColor={handleOrderColor}
            />
          </li>
        ))}
      </ul>
    </IcuSettingsCard>
  )
}
