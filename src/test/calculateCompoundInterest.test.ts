import { describe, expect, it } from 'vitest'
import { calculateCompoundInterest } from '../lib/compound-interest/calculateCompoundInterest.ts'
import { CompoundInterestError } from '../lib/errors/CompoundInterestError.ts'
import type { CompoundInterestFormData } from '../types/compoundInterest.ts'

const baseFormData: CompoundInterestFormData = {
  initialAmount: 1_000,
  contributionPerPeriod: 0,
  contributionFrequency: 'annual',
  annualInterestRate: 10,
  years: 1,
  isAdvancedMode: false,
  investmentPeriods: [],
}

describe('calculateCompoundInterest', () => {
  it('calcula un año sin aportes con capitalización anual', () => {
    const result = calculateCompoundInterest(baseFormData)

    expect(result.finalAmount).toBeCloseTo(1_100, 2)
    expect(result.totalContributions).toBe(1_000)
    expect(result.totalInterestEarned).toBeCloseTo(100, 2)
    expect(result.yearlyData).toHaveLength(1)
  })

  it('calcula aportes mensuales durante varios años', () => {
    const result = calculateCompoundInterest({
      ...baseFormData,
      contributionPerPeriod: 100,
      contributionFrequency: 'monthly',
      annualInterestRate: 0,
      years: 1,
    })

    expect(result.finalAmount).toBe(2_200)
    expect(result.totalContributions).toBe(2_200)
    expect(result.totalInterestEarned).toBe(0)
  })

  it('calcula el modo avanzado con dos tramos', () => {
    const result = calculateCompoundInterest({
      ...baseFormData,
      isAdvancedMode: true,
      annualInterestRate: 0,
      investmentPeriods: [
        { years: 2, contributionPerPeriod: 100 },
        { years: 1, contributionPerPeriod: 0 },
      ],
    })

    expect(result.yearlyData).toHaveLength(3)
    expect(result.finalAmount).toBe(1_200)
    expect(result.totalContributions).toBe(1_200)
  })

  it('admite retiradas periódicas con aportes negativos', () => {
    const result = calculateCompoundInterest({
      ...baseFormData,
      initialAmount: 10_000,
      contributionPerPeriod: -500,
      contributionFrequency: 'annual',
      annualInterestRate: 0,
      years: 2,
    })

    expect(result.finalAmount).toBe(9_000)
    expect(result.totalContributions).toBe(9_000)
  })

  it('rechaza años no positivos', () => {
    expect(() =>
      calculateCompoundInterest({
        ...baseFormData,
        years: 0,
      }),
    ).toThrow(CompoundInterestError)
  })
})
