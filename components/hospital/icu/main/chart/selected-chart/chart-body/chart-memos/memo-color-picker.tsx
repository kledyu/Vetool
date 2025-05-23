import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { MEMO_COLORS } from '@/constants/hospital/icu/chart/colors'
import { type MemoColor } from '@/types/icu/chart'
import { Check } from 'lucide-react'
import { type Dispatch, type SetStateAction, useState } from 'react'

type Props = {
  memoColor: MemoColor
  setMemoColor: Dispatch<SetStateAction<MemoColor>>
}

export default function MemoColorPicker({ memoColor, setMemoColor }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const handleSelectColor = (color: MemoColor) => {
    setMemoColor(color)
    setIsPopoverOpen(false)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild className="absolute right-1.5 top-1.5">
        <Button
          variant="outline"
          className="h-5 w-5 rounded-md border-2 border-white p-0 shadow-none"
          style={{ backgroundColor: memoColor }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-32 p-1" side="top">
        <div className="grid grid-cols-5 gap-1">
          {MEMO_COLORS.map((color) => (
            <Button
              key={color}
              variant="outline"
              className="h-5 w-5 rounded-md p-0"
              style={{ backgroundColor: color }}
              onClick={() => handleSelectColor(color)}
            >
              {memoColor === color && <Check className="h-4 w-4 text-white" />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
