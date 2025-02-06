'use client'

import CalculatorResult from '@/components/hospital/calculator/calculator-result'
import DietComboBox from '@/components/hospital/calculator/rer-mer/diet/diet-combo-box'
import DietFeedPerDayInput from '@/components/hospital/calculator/rer-mer/diet/diet-feed-per-day-input'
import { CardContent } from '@/components/ui/card'
import { cacluateFeedAmount } from '@/lib/calculators/rer-mer'
import { getDiets } from '@/lib/services/admin/diet/diet'
import { type Diet } from '@/types/hospital/calculator'
import { useEffect, useState } from 'react'

export default function DietForm({ mer }: { mer: number | null }) {
  const [diets, setDiets] = useState<Diet[]>([])
  const [selectedDiet, setSelectedDiet] = useState<string>('')
  const [unit, setUnit] = useState<string>('')
  const [feedPerDay, setFeedPerDay] = useState('2')
  const [feedAmount, setFeedAmount] = useState<number | null>(null)

  useEffect(() => {
    const fetchDiets = async () => {
      const diets = await getDiets()
      setDiets(diets)
    }

    fetchDiets()
  }, [setDiets])

  useEffect(() => {
    const massVol = diets.find((diet) => diet.name === selectedDiet)?.mass_vol
    const unit = diets.find((diet) => diet.name === selectedDiet)?.unit || 'g'
    setUnit(unit)

    if (mer && massVol && feedPerDay) {
      const feedAmount = cacluateFeedAmount(mer, massVol, Number(feedPerDay))

      setFeedAmount(feedAmount)
    }
  }, [mer, selectedDiet, feedPerDay, diets])

  const mappedDietList = diets.map((diet) => ({
    value: diet.name,
    label: diet.name,
  }))

  const handleCopyButtonClick = () => {
    if (feedAmount) {
      navigator.clipboard.writeText(feedAmount.toString())
    }
  }

  return (
    <CardContent className="gap-2">
      <div className="grid grid-cols-2 gap-2 pb-6">
        <DietComboBox
          mappedDietList={mappedDietList}
          selectedDiet={selectedDiet}
          setSelectedDiet={setSelectedDiet}
        />

        <DietFeedPerDayInput
          feedPerDay={feedPerDay}
          setFeedPerDay={setFeedPerDay}
        />
      </div>

      {feedAmount !== null && feedAmount > 0 && (
        <CalculatorResult
          result={feedAmount.toString()}
          unit={`${unit}/회`}
          onClick={handleCopyButtonClick}
        />
      )}
    </CardContent>
  )
}
