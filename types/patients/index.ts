import type { Owner, Patients, Vitals } from '@/types'

export type PatientDataTable = Omit<Patients, 'owner_id'> & {
  owner_id?: Owner
  isIcu: boolean
}
//  hos_patient_id, name, species, breed, gender, birth, owner_name

export type PatientsIdData = Pick<Patients, 'patient_id'>

export type PaginatedData<T> = {
  data: T
  total_count: number
  page: number
  itemsPerPage: number
}

export type OwnerDataTable = Owner

export type PatientWithWeight = {
  patient: Pick<
    Patients,
    'patient_id' | 'name' | 'species' | 'breed' | 'gender' | 'birth'
  >
  vital: Pick<Vitals, 'body_weight' | 'created_at'> | null
}
