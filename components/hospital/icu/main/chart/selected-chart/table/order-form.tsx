import DeleteOrderAlertDialog from '@/components/hospital/icu/main/chart/selected-chart/table/delete-order-alert-dialog'
import { orderSchema } from '@/components/hospital/icu/main/chart/selected-chart/table/order-schema'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { CELL_COLORS } from '@/constants/hospital/icu/chart/colors'
import { DEFAULT_ICU_ORDER_TYPE } from '@/constants/hospital/icu/chart/order'
import {
  TIMES,
  TX_ORDER_TIME_INTERVALS,
} from '@/constants/hospital/icu/chart/time'
import { upsertOrder } from '@/lib/services/icu/create-new-order'
import { updateHospitalOrder } from '@/lib/services/icu/hospital-orders'
import { useCreateOrderStore } from '@/lib/store/icu/create-order'
import { cn } from '@/lib/utils'
import { IcuChartOrderJoined } from '@/types/icu'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function OrderForm({
  icuIoId,
  icuChartId,
  isSettingMode,
}: {
  icuIoId?: string
  icuChartId?: string
  isSettingMode?: boolean
}) {
  const { hos_id } = useParams()
  const { refresh } = useRouter()
  const { toggleModal, selectedChartOrder, isEditMode, orderIndex } =
    useCreateOrderStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 왜 undefined로 안하고 "undefined"로 했냐면, 값을 undefined로 만들었을 때 ui가 초기화되지 않음
  const [startTime, setStartTime] = useState<string>('undefined')
  const [timeTerm, setTimeTerm] = useState<string>('undefined')
  const [orderTime, setOrderTime] = useState<string[]>(
    selectedChartOrder.icu_chart_order_time || new Array(24).fill('0'),
  )

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      icu_chart_order_type:
        selectedChartOrder.icu_chart_order_type ?? undefined,
      icu_chart_order_name:
        selectedChartOrder.icu_chart_order_name ?? undefined,
      icu_chart_order_comment:
        selectedChartOrder.icu_chart_order_comment ?? undefined,
    },
  })

  const handleSelectAllClick = () => {
    setStartTime('undefined')
    setTimeTerm('undefined')
    setOrderTime(Array(24).fill('1'))
  }

  const handleCancelAllClick = () => {
    setStartTime('undefined')
    setTimeTerm('undefined')
    setOrderTime(Array(24).fill('0'))
  }

  const handleSubmit = async (values: z.infer<typeof orderSchema>) => {
    setIsSubmitting(true)

    if (isSettingMode) {
      await updateHospitalOrder(hos_id as string, orderIndex, {
        hos_order_names: values.icu_chart_order_name.trim(),
        hos_order_comments: values.icu_chart_order_comment ?? '',
        hos_order_types: values.icu_chart_order_type,
      })
      refresh()
    } else {
      await upsertOrder(
        icuChartId!,
        icuIoId!,
        selectedChartOrder.icu_chart_order_id!,
        orderTime,
        hos_id as string,
        {
          icu_chart_order_type: values.icu_chart_order_type,
          icu_chart_order_name: values.icu_chart_order_name.trim(),
          icu_chart_order_comment: values.icu_chart_order_comment ?? null,
        },
      )
    }

    toast({
      title: `${values.icu_chart_order_name} 오더를 추가하였습니다`,
    })
    toggleModal()
    setIsSubmitting(false)
  }

  const handleTimeToggle = (index: number) => () => {
    setOrderTime((prevOrderTime) => {
      const newOrderTime = [...prevOrderTime]
      newOrderTime[index] = newOrderTime[index] === '1' ? '0' : '1'
      return newOrderTime
    })

    setStartTime('undefined')
    setTimeTerm('undefined')
  }

  useEffect(() => {
    if (startTime !== 'undefined' && timeTerm !== 'undefined') {
      const start = Number(startTime)
      const term = Number(timeTerm)
      const newOrderTime = Array(24).fill('0')

      for (let i = start - 1; i < 24; i += term) {
        newOrderTime[i] = '1'
      }

      setOrderTime(newOrderTime)
    }
  }, [form, startTime, timeTerm])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="icu_chart_order_type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-semibold">오더 타입*</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-3 space-x-2"
                >
                  {DEFAULT_ICU_ORDER_TYPE.map((item) => (
                    <FormItem
                      key={item.value}
                      className="flex items-center space-x-2 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={item.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icu_chart_order_name"
          render={({ field }) => (
            <FormItem className="w-full space-y-2">
              <FormLabel className="font-semibold">오더명*</FormLabel>
              <FormControl>
                <Input placeholder="오더명을 입력해주세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icu_chart_order_comment"
          render={({ field }) => (
            <FormItem className="w-full space-y-2">
              <FormLabel className="font-semibold">오더 설명</FormLabel>
              <FormControl>
                <Input
                  placeholder="오더에 대한 설명을 입력해주세요"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isSettingMode && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold">오더 시간 설정</span>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Select onValueChange={setStartTime} value={startTime}>
                  <SelectTrigger className="h-9 w-36 text-xs">
                    <SelectValue placeholder="시작 시간" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {['undefined', ...TIMES].map((time) => (
                        <SelectItem
                          value={time.toString()}
                          key={time}
                          className="text-xs"
                        >
                          {time === 'undefined'
                            ? '시작 시간'
                            : `${time}시 시작`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={setTimeTerm}
                  value={timeTerm}
                  disabled={startTime === 'undefined'}
                >
                  <SelectTrigger className="h-9 w-36 text-xs">
                    <SelectValue placeholder="시간 간격" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {['undefined', ...TX_ORDER_TIME_INTERVALS].map(
                        (interval) => (
                          <SelectItem
                            value={interval.toString()}
                            key={interval}
                            className="text-xs"
                          >
                            {interval === 'undefined'
                              ? '시간 간격'
                              : `${interval}시간 간격`}
                          </SelectItem>
                        ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSelectAllClick}
                >
                  전체선택
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelAllClick}
                >
                  전체취소
                </Button>
              </div>
            </div>
            <div className="mt-2 flex w-full justify-between">
              {TIMES.map((time, index) => (
                <Button
                  tabIndex={-1}
                  type="button"
                  variant="outline"
                  key={time}
                  className="h-6 w-7 px-3 py-2 text-xs"
                  style={{
                    background:
                      orderTime[index] === '1'
                        ? CELL_COLORS.NOT_DONE
                        : 'transparent',
                  }}
                  onClick={handleTimeToggle(index)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="ml-auto w-full">
          {isEditMode && (
            <DeleteOrderAlertDialog
              selectedChartOrder={selectedChartOrder as IcuChartOrderJoined}
              toggleModal={toggleModal}
              isSettingMode={isSettingMode}
            />
          )}

          <DialogClose asChild>
            <Button type="button" variant="outline">
              닫기
            </Button>
          </DialogClose>

          <Button type="submit" disabled={isSubmitting}>
            {isEditMode ? '변경' : '추가'}
            <LoaderCircle
              className={cn(isSubmitting ? 'ml-2 animate-spin' : 'hidden')}
            />
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
