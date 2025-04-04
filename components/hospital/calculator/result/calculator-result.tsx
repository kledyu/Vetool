import InsertOrderButton from './insert-order-button'
import CopyButton from './copy-button'

type Props = {
  displayResult: React.ReactNode
  copyResult: string
  comment?: string
  hasInsertOrderButton?: boolean
  setIsSheetOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CalculatorResult({
  displayResult,
  copyResult,
  comment,
  hasInsertOrderButton = false,
  setIsSheetOpen,
}: Props) {
  return (
    <div className="flex w-full animate-slideDown flex-col items-center justify-center rounded-md bg-slate-100 py-4 text-lg">
      <div className="flex items-center gap-1">
        {hasInsertOrderButton && (
          <InsertOrderButton
            orderName={copyResult}
            setIsSheetOpen={setIsSheetOpen}
          />
        )}
        <div className="text-xs sm:text-base">{displayResult}</div>

        <CopyButton copyResult={copyResult} />
      </div>

      {comment && <span className="text-sm font-normal">{comment}</span>}
    </div>
  )
}
