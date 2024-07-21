import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { getStaffList } from '@/lib/services/icu/get-staffs'
import { upsertIcuChartTxAndUpdateIcuChartOrder } from '@/lib/services/icu/upsert-chart-tx'
import { useUpsertTxStore } from '@/lib/store/icu/upsert-tx'
import { cn } from '@/lib/utils'
import type { IcuUserList, TxLog } from '@/types/icu'
import { format } from 'date-fns'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TxSelectUserStep() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { txLocalState, setTxLocalState, reset } = useUpsertTxStore()
  const { hos_id } = useParams()
  const [staffList, setStaffList] = useState<IcuUserList[]>([])

  useEffect(() => {
    getStaffList(hos_id as string).then((res) => {
      setStaffList(res)
    })
  }, [hos_id])

  const handleSelectUserId = (userId: string) => {
    setTxLocalState({ txUserId: userId })
  }

  const handleUpsertTx = async () => {
    setIsSubmitting(true)

    const newLog: TxLog = {
      result: txLocalState?.txResult ?? '',
      name:
        staffList.find((staff) => staff.user_id === txLocalState?.txUserId)
          ?.name ?? '미선택',
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
    }

    const updatedLogs = [...(txLocalState?.txLog ?? []), newLog]

    await upsertIcuChartTxAndUpdateIcuChartOrder(
      txLocalState,
      updatedLogs,
      hos_id as string,
    )

    toast({
      title: '처치 내역이 업데이트 되었습니다',
    })

    reset()
    setIsSubmitting(false)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>담당자 선택</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <Select
          onValueChange={handleSelectUserId}
          defaultValue={txLocalState?.txUserId || 'none'}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="담당자 선택" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {staffList.map((staff) => (
                <SelectItem key={staff.user_id} value={staff.user_id}>
                  <span>{staff.name}</span>
                  <span className="ml-2 text-xs">{staff.position}</span>
                </SelectItem>
              ))}

              <SelectItem value="none">
                <span>미선택</span>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DialogFooter>
        <Button type="button" onClick={handleUpsertTx} disabled={isSubmitting}>
          확인
          <LoaderCircle
            className={cn(isSubmitting ? 'ml-2 animate-spin' : 'hidden')}
          />
        </Button>
      </DialogFooter>
    </>
  )
}
