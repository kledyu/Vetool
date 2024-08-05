import PatientButton from '@/components/hospital/icu/sidebar/patient-button'
import { Separator } from '@/components/ui/separator'
import type { IcuIoPatientJoined } from '@/types/icu'

type IcuSidebarContentProps = {
  filteredIcuIoData: IcuIoPatientJoined[]
  excludedIcuIoData: IcuIoPatientJoined[]
}

export default function PatientList({
  filteredIcuIoData,
  excludedIcuIoData,
}: IcuSidebarContentProps) {
  return (
    <>
      {filteredIcuIoData.length > 0 ? (
        <ul className="flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-500">입원환자</span>
          {filteredIcuIoData.map((data) => (
            <li key={data.icu_io_id} className="w-full">
              <PatientButton data={data} />
            </li>
          ))}
        </ul>
      ) : (
        <span className="py-2 text-xs font-bold text-gray-500">
          필터링된 입원환자 없음
        </span>
      )}

      {excludedIcuIoData.length > 0 && (
        <>
          <Separator />

          <ul className="flex flex-col gap-2">
            <span className="text-xs font-bold text-gray-500">필터링 제외</span>
            {excludedIcuIoData.map((data) => (
              <li key={data.icu_io_id} className="w-full">
                <PatientButton data={data} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
