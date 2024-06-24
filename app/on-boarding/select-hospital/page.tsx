import { columns } from '@/components/on-boarding/select-hospital/columns'
import DataTable from '@/components/ui/data-table'
import { createClient } from '@/lib/supabase/server'
import logoWhite from '@/public/logo-white.svg'
import { SelectHosptialDataTable } from '@/types/on-boarding'
import Image from 'next/image'

export default async function SelectHospitalPage() {
  const supabase = createClient()

  const { data: hospitalData } = await supabase
    .from('hospitals')
    .select('hos_id, name, city, district')

  const data: SelectHosptialDataTable[] = hospitalData!.map((data) => ({
    city: data.city!,
    district: data.district!,
    hos_id: data.hos_id!,
    name: data.name!,
  }))

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-screen w-3/5 items-center justify-center bg-primary">
        <Image alt="vetool logo" src={logoWhite} unoptimized width={320} />
      </div>

      <div className="flex h-screen w-2/5 flex-col items-center justify-center gap-10 p-8">
        <h2 className="text-3xl font-bold tracking-wider">병원선택</h2>

        <DataTable
          columns={columns}
          data={data}
          searchKeyword="name"
          searchPlaceHolder="병원명을 검색하세요."
        />
      </div>
    </div>
  )
}
