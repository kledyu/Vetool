import HeaderDateSelector from '@/components/hospital/icu/header/date-picker/header-date-selector'
import HeaderCenter from '@/components/hospital/icu/main/chart/selected-chart/chart-header/header-center/header-center'
import HeaderRightButtons from '@/components/hospital/icu/main/chart/selected-chart/chart-header/header-right-buttons/header-right-buttons'
import type { SelectedChart } from '@/types/icu/chart'

export default function ChartHeader({
  chartData,
}: {
  chartData: SelectedChart
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white 2xl:relative 2xl:mx-0 2xl:max-w-full 2xl:bg-transparent 2xl:pb-2">
      <div className="ml-0 hidden md:ml-12 md:block 2xl:ml-0 2xl:hidden">
        <HeaderDateSelector />
      </div>
      <HeaderCenter chartData={chartData} />
      <HeaderRightButtons chartData={chartData} />
    </header>
  )
}
