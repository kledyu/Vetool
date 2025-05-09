'use client'

import LargeLoaderCircle from '@/components/common/large-loader-circle'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { type Json } from '@/lib/supabase/database.types'
import { useBasicHosDataContext } from '@/providers/basic-hos-data-context-provider'
import { type IcuChartsInCharge } from '@/types/adimin'
import { type MainAndSubVet } from '@/types/icu/chart'
import { Stethoscope } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import VetName from './vet-name'

const LazyVetsUpdateForm = dynamic(
  () =>
    import(
      '@/components/hospital/icu/main/chart/selected-chart/chart-body/chart-infos/vets/vets-update-form'
    ),
  {
    ssr: false,
    loading: () => <LargeLoaderCircle className="h-[200px]" />,
  },
)

type VetsProps = {
  mainVet: MainAndSubVet
  subVet: MainAndSubVet | null
  icuChartId: string
  inCharge: Json | null
}

export default function Vets({
  mainVet,
  subVet,
  icuChartId,
  inCharge,
}: VetsProps) {
  const { today } = (inCharge as IcuChartsInCharge) || {}

  const {
    basicHosData: { vetsListData, isInChargeSystem },
  } = useBasicHosDataContext()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full items-center justify-start gap-2 px-2"
        >
          <Stethoscope size={16} className="text-muted-foreground" />

          <div className="flex items-center gap-2 overflow-hidden">
            <VetName label="주치의" name={mainVet.name} />

            <Separator orientation="vertical" className="h-4" />

            <VetName label="부주치의" name={subVet?.name ?? '미선택'} />

            {isInChargeSystem && (
              <>
                <Separator orientation="vertical" className="h-4" />

                <VetName label="당일" name={today?.all ?? '미선택'} />

                <Separator orientation="vertical" className="h-4" />

                <VetName label="오전" name={today?.am ?? '미선택'} />

                <Separator orientation="vertical" className="h-4" />

                <VetName label="오후" name={today?.pm ?? '미선택'} />
              </>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>담당의 변경</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <LazyVetsUpdateForm
          setIsDialogOpen={setIsDialogOpen}
          mainVet={mainVet}
          subVet={subVet}
          vetsList={vetsListData}
          icuChartId={icuChartId}
          inCharge={inCharge}
          isInChargeSystem={isInChargeSystem}
        />
      </DialogContent>
    </Dialog>
  )
}
