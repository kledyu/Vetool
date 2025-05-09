export type Plans = 'free' | 'mild' | 'moderate' | 'severe'
export type Features =
  | 'CALCULATOR'
  | 'SURGERY'
  | 'ECHOCARDIO'
  | 'CHECKUP'
  | 'ANALYTICS'

const PLANS = {
  mild: {
    MAX_VETS: 3,
    MAX_CHART_PER_DAY: 5,
    CALCULATOR: false,
    SURGERY: false,
    ECHOCARDIO: false,
    CHECKUP: false,
    ANALYTICS: false,
  },
  moderate: {
    MAX_VETS: 10,
    MAX_CHART_PER_DAY: 999,
    CALCULATOR: true,
    SURGERY: true,
    ECHOCARDIO: true,
    CHECKUP: true,
    ANALYTICS: false,
  },
  severe: {
    MAX_VETS: 999,
    MAX_CHART_PER_DAY: 999,
    CALCULATOR: true,
    SURGERY: true,
    ECHOCARDIO: true,
    CHECKUP: true,
    ANALYTICS: true,
  },
  free: {
    MAX_VETS: 999,
    MAX_CHART_PER_DAY: 999,
    CALCULATOR: true,
    SURGERY: true,
    ECHOCARDIO: true,
    CHECKUP: true,
    ANALYTICS: true,
  },
} as const

export const canAddVet = (plan: Plans, currenVetNumber: number) => {
  return currenVetNumber < PLANS[plan].MAX_VETS
}

export const checkMaxVets = (plan: Plans) => {
  return PLANS[plan].MAX_VETS
}

export const getInvitableVetCount = (plan: Plans, currentVetNumber: number) => {
  return PLANS[plan].MAX_VETS - currentVetNumber
}

export const hasPermissions = (plan: Plans, feature: Features) => {
  return PLANS[plan][feature]
}

export const canAddChart = (plan: Plans, currentChartNumber: number) => {
  return currentChartNumber < PLANS[plan].MAX_CHART_PER_DAY
}
