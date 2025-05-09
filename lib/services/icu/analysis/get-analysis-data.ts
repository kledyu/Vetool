'use server'

import { createClient } from '@/lib/supabase/server'
import type { IcuAnalysisData } from '@/types/icu/analysis'

export const getAnalysisData = async (
  hosId: string,
  targetDate: string,
  startDate: string,
  endDate: string,
) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .rpc('get_icu_analysis_data', {
      hos_id_input: hosId,
      target_date_input: targetDate,
      start_date_input: startDate,
      end_date_input: endDate,
    })

  if (error) {
    throw new Error(error.message)
  }

  return data as IcuAnalysisData[] ? (data as IcuAnalysisData[]).filter((chart) => chart.patient.name !== null) : []
}
