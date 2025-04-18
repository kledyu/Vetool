import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { changeTargetDateInUrl } from '@/lib/utils/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function IcuDatePicker({ targetDate }: { targetDate: string }) {
  const { push } = useRouter()
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const path = usePathname()

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd')
      const newPath = changeTargetDateInUrl(path, formattedDate, params)
      push(newPath)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="h-8 px-2 py-0 text-base font-semibold"
          variant="ghost"
        >
          {format(targetDate, 'yyyy-MM-dd')}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          className="text-sm"
          styles={{
            button: { fontSize: 12 },
          }}
          captionLayout="dropdown-buttons"
          showOutsideDays
          fixedWeeks
          locale={ko}
          mode="single"
          initialFocus
          selected={new Date(targetDate)}
          onSelect={(date) => handleSelectDate(date)}
        />
      </PopoverContent>
    </Popover>
  )
}
