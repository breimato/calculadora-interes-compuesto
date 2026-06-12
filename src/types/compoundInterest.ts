export type ContributionFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual'

export interface InvestmentPeriod {
  years: number
  contributionPerPeriod: number
}

export interface CompoundInterestFormData {
  initialAmount: number
  contributionPerPeriod: number
  contributionFrequency: ContributionFrequency
  annualInterestRate: number
  years: number
  isAdvancedMode: boolean
  investmentPeriods: InvestmentPeriod[]
}

export const CONTRIBUTION_FREQUENCY_OPTIONS: {
  value: ContributionFrequency
  label: string
  periodsPerYear: number
}[] = [
  { value: 'monthly', label: 'Mensual', periodsPerYear: 12 },
  { value: 'quarterly', label: 'Trimestral', periodsPerYear: 4 },
  { value: 'semiannual', label: 'Semestral', periodsPerYear: 2 },
  { value: 'annual', label: 'Anual', periodsPerYear: 1 },
]

export const DEFAULT_COMPOUND_INTEREST_FORM_DATA: CompoundInterestFormData = {
  initialAmount: 10_000,
  contributionPerPeriod: 1_000,
  contributionFrequency: 'monthly',
  annualInterestRate: 8,
  years: 20,
  isAdvancedMode: false,
  investmentPeriods: [
    { years: 10, contributionPerPeriod: 1_000 },
    { years: 10, contributionPerPeriod: 0 },
  ],
}

export function getPeriodsPerYear(frequency: ContributionFrequency): number {
  return (
    CONTRIBUTION_FREQUENCY_OPTIONS.find((option) => option.value === frequency)
      ?.periodsPerYear ?? 12
  )
}

export function getTotalYearsFromPeriods(investmentPeriods: InvestmentPeriod[]): number {
  return investmentPeriods.reduce((sum, period) => sum + period.years, 0)
}
