import CalculatorResult from '@/components/hospital/calculator/calculator-result'
import RehydrationToolTip from '@/components/hospital/calculator/fluid-rate/rehydration/rehydration-tool-tip'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { calculateRehydration } from '@/lib/calculators/fluid-rate'
import {
  rehydrationFormSchema,
  type RehydrationFormValues,
} from '@/lib/schemas/calculator/fluid-rate-schema'
import { type CalculatorTabProps } from '@/types/hospital/calculator'
import { zodResolver } from '@hookform/resolvers/zod'
import { type MouseEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function RehydrationTab({
  formData,
  setFormData,
  tab,
}: CalculatorTabProps) {
  const [result, setResult] = useState<{
    totalMl: number
    ratePerHour: number
  } | null>(null)

  const form = useForm<RehydrationFormValues>({
    resolver: zodResolver(rehydrationFormSchema),
    defaultValues: {
      weight: formData.weight,
      dehydration: '5',
      time: '12',
    },
  })

  useEffect(() => {
    const values = form.getValues()

    if (values.weight) {
      const calculatedRate = calculateRehydration(
        values.weight,
        values.dehydration,
        values.time,
      )
      setResult(calculatedRate)
    }
  }, [tab, form])

  useEffect(() => {
    const subscription = form.watch((value) => {
      form.trigger().then((isValid) => {
        if (isValid && value.weight) {
          const result = calculateRehydration(
            value.weight!,
            value.dehydration!,
            value.time!,
          )
          setResult(result)
        } else {
          setResult(null)
        }
      })
    })
    return () => subscription.unsubscribe()
  }, [form, setFormData])

  const handleCopyButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigator.clipboard.writeText(result?.ratePerHour.toString() ?? '')
    toast({
      title: '계산 결과가 클립보드에 복사되었습니다.',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Rehydration <RehydrationToolTip />
        </CardTitle>
        <CardDescription>
          *on-going loss 및 maintenance rate는 계산하지 않음
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form>
          <CardContent className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>체중 (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="체중을 입력하세요"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        setFormData((prev) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dehydration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>탈수 정도</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="탈수 정도 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="7">7%</SelectItem>
                      <SelectItem value="9">9%</SelectItem>
                      <SelectItem value="11">11%</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>교정 시간</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="교정 시간을 입력하세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardContent className="pt-4">
            {result && (
              <CalculatorResult
                result={result.ratePerHour.toString()}
                unit="ml/hr"
                comment={`(${result.totalMl}ml를 ${form.watch('time')}시간동안 주입)`}
                onClick={handleCopyButtonClick}
              />
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  )
}
