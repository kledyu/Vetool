import NoResult from '@/components/common/no-result'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils/utils'
import { type SearchedPatientsData } from '@/types/patients'
import { type Dispatch, type SetStateAction } from 'react'
import { type RegisteringPatient } from '../register-dialog'
import SearchPatientTableRow from './search-patient-table-row'

type SearchPatientTableProps = {
  searchedPatients: SearchedPatientsData[]
  setIsEdited: Dispatch<SetStateAction<boolean>>
  isIcu?: boolean
  setIsConfirmDialogOpen?: Dispatch<SetStateAction<boolean>>
  setRegisteringPatient?: Dispatch<SetStateAction<RegisteringPatient | null>>
}

export default function SearchPatientTable({
  searchedPatients,
  setIsEdited,
  isIcu,
  setIsConfirmDialogOpen,
  setRegisteringPatient,
}: SearchPatientTableProps) {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap text-center">종</TableHead>
          <TableHead className="whitespace-nowrap text-center">
            환자 번호
          </TableHead>
          <TableHead className="whitespace-nowrap text-center">이름</TableHead>
          <TableHead className="whitespace-nowrap text-center">품종</TableHead>
          <TableHead className="whitespace-nowrap text-center">성별</TableHead>
          <TableHead className="whitespace-nowrap text-center">
            나이 (생일)
          </TableHead>
          <TableHead className="whitespace-nowrap text-center">
            보호자
          </TableHead>
          <TableHead className="whitespace-nowrap text-center">
            등록일
          </TableHead>
          {isIcu ? (
            <TableHead className="whitespace-nowrap text-center">
              환자선택
            </TableHead>
          ) : (
            <>
              <TableHead className="whitespace-nowrap text-center">
                수정
              </TableHead>
              <TableHead className="whitespace-nowrap text-center">
                삭제
              </TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {searchedPatients && searchedPatients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10}>
              <NoResult
                title="검색 결과가 없습니다"
                className={cn(isIcu ? 'h-[430px]' : 'h-[513px]')}
              />
            </TableCell>
          </TableRow>
        ) : (
          searchedPatients.map((patient) => (
            <SearchPatientTableRow
              key={patient.patient_id}
              patientData={patient}
              setIsEdited={setIsEdited}
              isIcu={isIcu}
              setIsConfirmDialogOpen={setIsConfirmDialogOpen}
              setRegisteringPatient={setRegisteringPatient}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
