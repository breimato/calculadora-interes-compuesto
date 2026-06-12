import { CompoundInterestError } from '../errors/CompoundInterestError.ts'
import {
  getPeriodsPerYear,
  getTotalYearsFromPeriods,
  type CompoundInterestFormData,
  type InvestmentPeriod,
} from '../../types/compoundInterest.ts'
import type { CompoundInterestResult } from '../../types/CompoundInterestResult.ts'

function validateFormData(formData: CompoundInterestFormData): void {
  if (!Number.isFinite(formData.initialAmount) || formData.initialAmount < 0) {
    throw new CompoundInterestError(
      'INVALID_INPUT',
      'La cantidad inicial no puede ser negativa.',
    )
  }

  if (
    !Number.isFinite(formData.annualInterestRate) ||
    formData.annualInterestRate < 0
  ) {
    throw new CompoundInterestError(
      'INVALID_INPUT',
      'La tasa de interés anual no puede ser negativa.',
    )
  }

  const totalYears = formData.isAdvancedMode
    ? getTotalYearsFromPeriods(formData.investmentPeriods)
    : formData.years

  if (!Number.isFinite(totalYears) || totalYears <= 0) {
    throw new CompoundInterestError(
      'INVALID_INPUT',
      'Los años a invertir deben ser mayores que cero.',
    )
  }

  if (formData.isAdvancedMode) {
    for (const [index, period] of formData.investmentPeriods.entries()) {
      if (!Number.isFinite(period.years) || period.years <= 0) {
        throw new CompoundInterestError(
          'INVALID_INPUT',
          `El período ${index + 1} debe tener una duración mayor que cero.`,
        )
      }

      if (!Number.isFinite(period.contributionPerPeriod)) {
        throw new CompoundInterestError(
          'INVALID_INPUT',
          `Introduce un aporte válido para el período ${index + 1}.`,
        )
      }
    }
  } else if (!Number.isFinite(formData.contributionPerPeriod)) {
    throw new CompoundInterestError(
      'INVALID_INPUT',
      'Introduce un aporte periódico válido.',
    )
  }
}

function runSimulation(
  initialAmount: number,
  annualInterestRate: number,
  periodsPerYear: number,
  periodConfigs: InvestmentPeriod[],
): CompoundInterestResult {
  const interestRatePerPeriod = annualInterestRate / 100 / periodsPerYear

  let balance = initialAmount
  let totalContributions = initialAmount

  const years: number[] = []
  const totalInvested: number[] = []
  const totalInterest: number[] = []
  const totalAmount: number[] = []
  const yearlyData: CompoundInterestResult['yearlyData'] = []

  let currentYear = 1

  for (const periodConfig of periodConfigs) {
    for (let yearIndex = 0; yearIndex < periodConfig.years; yearIndex += 1) {
      const startYearBalance = balance
      let yearlyContribution = 0
      let yearlyInterest = 0

      for (let periodIndex = 0; periodIndex < periodsPerYear; periodIndex += 1) {
        balance += periodConfig.contributionPerPeriod
        yearlyContribution += periodConfig.contributionPerPeriod
        totalContributions += periodConfig.contributionPerPeriod

        const periodInterest = balance * interestRatePerPeriod
        balance += periodInterest
        yearlyInterest += periodInterest
      }

      yearlyData.push({
        year: currentYear,
        startBalance: startYearBalance,
        contribution: yearlyContribution,
        interest: yearlyInterest,
        endBalance: balance,
      })

      years.push(currentYear)
      totalInvested.push(totalContributions)
      totalInterest.push(balance - totalContributions)
      totalAmount.push(balance)
      currentYear += 1
    }
  }

  return {
    years,
    totalInvested,
    totalInterest,
    totalAmount,
    yearlyData,
    finalAmount: balance,
    totalContributions,
    totalInterestEarned: balance - totalContributions,
  }
}

export function calculateCompoundInterest(
  formData: CompoundInterestFormData,
): CompoundInterestResult {
  validateFormData(formData)

  const periodsPerYear = getPeriodsPerYear(formData.contributionFrequency)

  const periodConfigs = formData.isAdvancedMode
    ? formData.investmentPeriods
    : [{ years: formData.years, contributionPerPeriod: formData.contributionPerPeriod }]

  return runSimulation(
    formData.initialAmount,
    formData.annualInterestRate,
    periodsPerYear,
    periodConfigs,
  )
}
