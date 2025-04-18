'use client'
'use no memo'

import HelperTooltip from '@/components/common/helper-tooltip'
import BirthDatePicker from '@/components/common/patients/form/birth-date-picker'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import {
  CANINE_BREEDS,
  FELINE_BREEDS,
  SEX,
} from '@/constants/hospital/register/breed'
import { registerPatientFormSchema } from '@/lib/schemas/patient/patient-schema'
import {
  insertPatient,
  isHosPatientIdDuplicated,
  updatePatientFromIcu,
  updatePatientFromPatientRoute,
} from '@/lib/services/patient/patient'
import { cn } from '@/lib/utils/utils'
import { type Patients } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { type DebouncedState, useDebouncedCallback } from 'use-debounce'
import * as z from 'zod'
import { type RegisteringPatient } from '../../../hospital/icu/sidebar/register-dialog/register-dialog'

type BaseProps = {
  hosId: string
}

type RegisterFromPatientRoute = BaseProps & {
  mode: 'registerFromPatientRoute'
  setIsPatientRegisterDialogOpen: Dispatch<SetStateAction<boolean>>
  editingPatient?: null
  weight?: null
  weightMeasuredDate?: null
  setIsPatientUpdateDialogOpen?: null
  setIsConfirmDialogOpen?: null
  icuChartId?: null
  setIsEdited?: Dispatch<SetStateAction<boolean>>
  registeringPatient: null
  setRegisteringPatient: null
  debouncedSearch: null
}

type UpdateFromPatientRoute = BaseProps & {
  mode: 'updateFromPatientRoute'
  editingPatient: Patients
  setIsPatientRegisterDialogOpen?: null
  setIsConfirmDialogOpen?: null
  weight: string
  weightMeasuredDate: string
  setIsPatientUpdateDialogOpen: Dispatch<SetStateAction<boolean>>
  icuChartId?: null
  setIsEdited?: Dispatch<SetStateAction<boolean>>
  registeringPatient: null
  setRegisteringPatient: null
  debouncedSearch: DebouncedState<() => Promise<void>>
}

type RegisterFromIcuRoute = BaseProps & {
  mode: 'registerFromIcuRoute'
  setIsPatientRegisterDialogOpen: Dispatch<SetStateAction<boolean>>
  setIsConfirmDialogOpen?: (isOpen: boolean) => void
  editingPatient?: null
  weight?: null
  weightMeasuredDate?: null
  setIsPatientUpdateDialogOpen?: null
  icuChartId?: null
  setIsEdited?: Dispatch<SetStateAction<boolean>>
  registeringPatient: RegisteringPatient
  setRegisteringPatient: Dispatch<SetStateAction<RegisteringPatient | null>>
  debouncedSearch: null
}

type UpdateFromIcuRoute = BaseProps & {
  mode: 'updateFromIcuRoute'
  editingPatient: Patients
  setIsPatientRegisterDialogOpen?: null
  setIsConfirmDialogOpen?: null
  weight: string
  weightMeasuredDate: string | null
  setIsPatientUpdateDialogOpen: Dispatch<SetStateAction<boolean>>
  icuChartId: string
  registeringPatient: null
  setRegisteringPatient: null
  debouncedSearch: null
}

type Props =
  | RegisterFromPatientRoute
  | UpdateFromPatientRoute
  | RegisterFromIcuRoute
  | UpdateFromIcuRoute

export default function PatientForm({
  hosId,
  mode,
  setIsPatientRegisterDialogOpen,
  setIsConfirmDialogOpen,
  editingPatient,
  weight,
  weightMeasuredDate,
  setIsPatientUpdateDialogOpen,
  icuChartId,
  registeringPatient,
  setRegisteringPatient,
  debouncedSearch,
}: Props) {
  const isEdit =
    mode === 'updateFromPatientRoute' || mode === 'updateFromIcuRoute'
  const isRegisterFromIcuRoute = mode === 'registerFromIcuRoute'

  const { refresh } = useRouter()

  const [breedOpen, setBreedOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDuplicatedId, setIsDuplicatedId] = useState(false)

  let defaultBreed: string

  if (editingPatient?.species === 'canine') {
    defaultBreed = [
      editingPatient?.breed,
      CANINE_BREEDS.find((breed) => breed.eng === editingPatient?.breed)?.kor,
    ].join('#')
  }
  if (editingPatient?.species === 'feline') {
    defaultBreed = [
      editingPatient?.breed,
      FELINE_BREEDS.find((breed) => breed.eng === editingPatient?.breed)?.kor,
    ].join('#')
  }

  const form = useForm<z.infer<typeof registerPatientFormSchema>>({
    resolver: zodResolver(
      registerPatientFormSchema.refine(
        async (data) => {
          // 중복 확인을 비동기로 처리
          if (
            isEdit &&
            data.hos_patient_id === editingPatient?.hos_patient_id
          ) {
            // 편집 모드일 때, 기존 환자 번호와 동일하면 통과
            return true
          }

          // 중복 여부 확인
          const isDuplicate = await isHosPatientIdDuplicated(
            data.hos_patient_id,
            hosId,
          )
          return !isDuplicate
        },
        {
          message: '이 환자 번호는 이미 존재합니다',
          path: ['hos_patient_id'],
        },
      ),
    ),
    defaultValues: isEdit
      ? {
          name: editingPatient?.name,
          hos_patient_id: editingPatient?.hos_patient_id,
          species: editingPatient?.species,
          breed: defaultBreed!,
          gender: editingPatient?.gender,
          birth: new Date(editingPatient?.birth!),
          microchip_no: editingPatient?.microchip_no ?? '',
          memo: editingPatient?.memo ?? '',
          weight: weight,
          owner_name: editingPatient?.owner_name ?? '',
          hos_owner_id: editingPatient?.hos_owner_id ?? '',
        }
      : {
          name: '',
          hos_patient_id: '',
          species: undefined,
          breed: undefined,
          gender: undefined,
          birth: undefined,
          microchip_no: '',
          memo: '',
          weight: '',
          owner_name: '',
          hos_owner_id: '',
        },
  })

  const watchHosPatientId = form.watch('hos_patient_id')
  const watchSpecies = form.watch('species')
  const watchBreed = form.watch('breed')
  const BREEDS = watchSpecies === 'canine' ? CANINE_BREEDS : FELINE_BREEDS

  useEffect(() => {
    if (watchBreed) {
      setBreedOpen(false)
    }
    form.setValue('weight', weight ?? '')
  }, [watchBreed, weight, form])

  const handleRegister = async (
    values: z.infer<typeof registerPatientFormSchema>,
  ) => {
    // 0. 환자 번호 중복 확인
    if (isDuplicatedId) return

    setIsSubmitting(true)

    const {
      birth,
      breed,
      gender,
      hos_owner_id,
      hos_patient_id,
      memo,
      microchip_no,
      name,
      species,
      owner_name,
      weight,
    } = values

    // 1. 환자 등록
    const patientId = await insertPatient(
      {
        birth: format(birth, 'yyyy-MM-dd'),
        breed: breed.split('#')[0],
        gender,
        hos_patient_id,
        memo,
        microchip_no,
        name,
        species,
        owner_name,
        hos_owner_id,
        weight,
      },
      hosId,
    )

    toast({
      title: '환자가 등록되었습니다',
    })

    // 2. 환자 등록 완료 및 다음 스텝
    if (!isRegisterFromIcuRoute) {
      setIsPatientRegisterDialogOpen!(false)

      refresh()
    } else {
      setIsConfirmDialogOpen!(true)

      setRegisteringPatient({
        patientId,
        birth: format(values.birth, 'yyyy-MM-dd'),
        patientName: values.name,
        hosPatientId: values.hos_patient_id,
        species: values.species,
        breed: values.breed,
        gender: values.gender,
        microchipNo: values.microchip_no,
        memo: values.memo,
        weight: values.weight,
        ownerName: values.owner_name,
        ownerId: values.hos_owner_id,
      })
    }

    setIsSubmitting(false)
  }

  const handleUpdate = async (
    values: z.infer<typeof registerPatientFormSchema>,
  ) => {
    if (isDuplicatedId) {
      return
    }
    const {
      birth,
      breed,
      gender,
      hos_owner_id,
      hos_patient_id,
      memo,
      microchip_no,
      name,
      owner_name,
      species,
      weight: weightInput,
    } = values
    const isWeightChanged = weightInput !== weight

    setIsSubmitting(true)

    if (mode === 'updateFromPatientRoute') {
      await updatePatientFromPatientRoute(
        {
          birth: format(birth, 'yyyy-MM-dd'),
          breed: breed.split('#')[0],
          gender,
          hos_owner_id,
          hos_patient_id,
          memo,
          microchip_no,
          name,
          owner_name,
          species,
          weight: weightInput,
        },
        editingPatient?.patient_id!,
        isWeightChanged,
      )
      debouncedSearch()
    }

    if (mode === 'updateFromIcuRoute') {
      await updatePatientFromIcu(
        {
          birth: format(birth, 'yyyy-MM-dd'),
          breed: breed.split('#')[0],
          gender,
          hos_owner_id,
          hos_patient_id,
          memo,
          microchip_no,
          name,
          owner_name,
          species,
          weight: weightInput,
        },
        editingPatient?.patient_id!,
        icuChartId,
        format(new Date(), 'yyyy-MM-dd'),
        isWeightChanged,
      )
    }

    toast({
      title: '환자 정보가 수정되었습니다',
    })

    // if (setIsEdited) setIsEdited(true)
    setIsSubmitting(false)
    setIsPatientUpdateDialogOpen!(false)
    refresh()
  }

  const handleHosPatientIdInputChange = useDebouncedCallback(async () => {
    if (
      watchHosPatientId.trim() === '' ||
      watchHosPatientId === editingPatient?.hos_patient_id
    ) {
      form.clearErrors('hos_patient_id')
      return
    }

    const result = await isHosPatientIdDuplicated(watchHosPatientId, hosId)
    setIsDuplicatedId(result)

    if ((!isEdit && result) || (isEdit && result)) {
      form.setError('hos_patient_id', {
        type: 'manual',
        message: '이 환자 번호는 이미 존재합니다',
      })
    } else {
      form.clearErrors('hos_patient_id')
    }
  }, 700)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(isEdit ? handleUpdate : handleRegister)}
        className="grid grid-cols-2 gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">
                환자 이름 <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="h-8 text-sm"
                  autoComplete="off"
                  id="name"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hos_patient_id"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <div className="flex items-center gap-2">
                <FormLabel>
                  환자 번호 <span className="text-destructive">*</span>
                </FormLabel>
                <HelperTooltip>메인차트에 등록되어있는 환자번호</HelperTooltip>
              </div>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e)
                    handleHosPatientIdInputChange()
                  }}
                  className="h-8 text-sm"
                />
              </FormControl>

              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                종 <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  form.setValue('breed', '')
                }}
                defaultValue={field.value}
                name="species"
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
                  <SelectItem value="canine" className="text-xs">
                    Canine
                  </SelectItem>
                  <SelectItem value="feline" className="text-xs">
                    Feline
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end">
              <FormLabel>
                품종 <span className="text-destructive">*</span>
              </FormLabel>
              <Popover open={breedOpen} onOpenChange={setBreedOpen} modal>
                <PopoverTrigger asChild disabled={!watchSpecies}>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'relative h-8 w-full justify-start overflow-hidden border border-input bg-inherit px-3 text-sm font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      <span className="block overflow-hidden text-ellipsis whitespace-nowrap pr-6">
                        {field.value
                          ? `${field.value.split('#')[1]} (${field.value.split('#')[0]})`
                          : watchSpecies
                            ? '품종을 선택해주세요'
                            : '종을 먼저 선택해주세요'}
                      </span>
                      <CaretSortIcon className="absolute right-3 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                  side="bottom"
                >
                  <Command className="w-full">
                    <CommandInput
                      placeholder="품종 검색"
                      className="h-8 text-xs"
                      name="breed"
                    />
                    <CommandList>
                      <ScrollArea className="h-64">
                        <CommandEmpty>해당 품종 검색 결과 없음.</CommandEmpty>
                        <CommandGroup>
                          {BREEDS.map((breed) => (
                            <CommandItem
                              value={breed.eng + '#' + breed.kor}
                              key={breed.id + breed.eng}
                              onSelect={field.onChange}
                              className="text-xs"
                            >
                              {`${breed.kor} (${breed.eng})`}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  breed.eng === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                성별 <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                name="sex"
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      'h-8 text-sm',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    <SelectValue placeholder="성별을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SEX.map((sex) => (
                    <SelectItem
                      id={sex.value}
                      key={sex.value}
                      value={sex.value}
                      className="text-xs"
                    >
                      {sex.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <BirthDatePicker
          form={form}
          birth={
            isEdit
              ? new Date(editingPatient?.birth!)
              : new Date(registeringPatient?.birth ?? new Date())
          }
        />

        <FormField
          control={form.control}
          name="microchip_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>마이크로칩 번호</FormLabel>
              <FormControl>
                <Input {...field} className="h-8 text-sm" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                몸무게{' '}
                <span className="text-xs text-muted-foreground">
                  {weightMeasuredDate ? `(${weightMeasuredDate} 측정)` : ''}
                </span>
              </FormLabel>
              <div className="relative flex">
                <FormControl>
                  <Input {...field} className="h-8 text-sm" />
                </FormControl>
                <span className="absolute right-2 top-2 text-xs">kg</span>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>보호자 이름</FormLabel>
              <FormControl>
                <Input {...field} className="h-8 text-sm" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hos_owner_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>보호자 번호</FormLabel>
              <FormControl>
                <Input {...field} className="h-8 text-sm" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="memo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>메모</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2 ml-auto flex gap-2">
          <Button
            tabIndex={-1}
            type="button"
            disabled={isSubmitting}
            variant="outline"
            onClick={() => {
              isEdit
                ? setIsPatientUpdateDialogOpen(false)
                : setIsPatientRegisterDialogOpen!(false)
            }}
          >
            {isEdit ? '취소' : '닫기'}
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? '수정' : '등록'}
            <LoaderCircle
              className={cn(isSubmitting ? 'ml-2 animate-spin' : 'hidden')}
            />
          </Button>
        </div>
      </form>
    </Form>
  )
}
