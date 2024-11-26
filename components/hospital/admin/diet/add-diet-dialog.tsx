'use client'

import { dietSchema } from '@/components/hospital/admin/diet/diet-schema'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { upsertDietData } from '@/lib/services/admin/diet/diet'
import { cn } from '@/lib/utils/utils'
import type { AdminDietData } from '@/types/adimin'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit, LoaderCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function AddDietDialog({
  dietData,
  isEdit,
}: {
  dietData?: AdminDietData
  isEdit?: boolean
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [unit, setUnit] = useState('g')

  const { hos_id } = useParams()
  const { refresh } = useRouter()

  const form = useForm<z.infer<typeof dietSchema>>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      diet_products_id: dietData?.diet_products_id || undefined,
      name: dietData?.name || '',
      description: dietData?.description || null,
      company: dietData?.company || '',
      mass_vol: dietData?.mass_vol || 0,
      unit: dietData?.unit || unit,
    },
  })

  const handleSubmit = async (values: z.infer<typeof dietSchema>) => {
    setIsSubmitting(true)

    await upsertDietData({ ...values, hos_id: hos_id as string })

    form.reset()
    setIsDialogOpen(false)
    setIsSubmitting(false)

    refresh()
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isEdit ? 'ghost' : 'default'}
          className={cn(isEdit ? 'block px-8' : 'fixed left-16 top-1.5 z-20')}
        >
          {isEdit ? <Edit size={18} /> : '사료 추가'}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? '사료 수정' : '새 사료 추가'}</DialogTitle>
          <DialogDescription>사료의 상세 정보를 입력해주세요</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* 사료명 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사료명*</FormLabel>
                  <FormControl>
                    <Input placeholder="사료명 입력" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 제조사  */}
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제조사*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="제조사 입력"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 설명 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="사료 설명 입력"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 총량과 단위 */}
            <div className="flex space-x-4">
              {/* 단위 */}
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>단위*</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          setUnit(value)
                          field.onChange(value)
                        }}
                        defaultValue={field.value}
                        name="unit"
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              'h-8 text-sm',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            <SelectValue placeholder="종을 선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="g" className="text-xs">
                            g
                          </SelectItem>
                          <SelectItem value="ml" className="text-xs">
                            ml
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 단위당 칼로리 */}
              <FormField
                control={form.control}
                name="mass_vol"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>단위당 칼로리*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="단위당 칼로리 입력"
                          {...field}
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                          {`kcal/${unit}`}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="ml-auto w-full gap-2 md:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="outline" tabIndex={-1}>
                  닫기
                </Button>
              </DialogClose>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  `${isEdit ? '수정' : '추가'}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
